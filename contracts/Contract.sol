// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EProcurement {
    struct Profile {
        string name;
        string phoneNumber1;
        string phoneNumber2;
        string email;
        string about;
        string role; // "Bidder" or "Issuer"
    }

    struct Tender {
        string description;
        uint256 deadline;
        uint256 minBidAmount;
        bool isClosed;
        bool isCancelled;
        address issuer;
        address winningBidder;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        bool isWinningBid;
    }

    mapping(address => Profile) public profiles;
    mapping(uint256 => Tender) public tenders;
    mapping(uint256 => Bid[]) public tenderBids;
    mapping(address => uint256[]) public savedTenders;
    uint256 public nextTenderId;

    mapping(address => uint8) public issuerRatingsSum;
    mapping(address => uint8) public issuerRatingsCount;
    mapping(address => uint8) public bidderRatingsSum;
    mapping(address => uint8) public bidderRatingsCount;

    event ProfileCreated(address user, string role);
    event TenderCreated(uint256 tenderId, address issuer);
    event TenderCancelled(uint256 tenderId);
    event BidSubmitted(uint256 tenderId, address bidder, uint256 amount);
    event BidWithdrawn(uint256 tenderId, address bidder);
    event TenderClosed(uint256 tenderId, address winner, uint256 amount);
    event DeliveryConfirmed(uint256 tenderId, address issuer, address bidder);
    event TenderSaved(uint256 tenderId, address bidder);
    event TenderUnsaved(uint256 tenderId, address bidder);
    event PenaltyImposed(uint256 tenderId, address bidder, uint256 penaltyAmount);
    event IssuerRated(address issuer, uint8 rating);
    event BidderRated(address bidder, uint8 rating);

    modifier onlyIssuer(uint256 tenderId) {
        require(tenders[tenderId].issuer == msg.sender, "Only the issuer can perform this action.");
        _;
    }

    modifier onlyBeforeDeadline(uint256 tenderId) {
        require(block.timestamp < tenders[tenderId].deadline, "Action can only be performed before the deadline.");
        _;
    }

    modifier onlyAfterDeadline(uint256 tenderId) {
        require(block.timestamp >= tenders[tenderId].deadline, "Action can only be performed after the deadline.");
        _;
    }

    function createProfile(
        string memory name,
        string memory phoneNumber1,
        string memory phoneNumber2,
        string memory email,
        string memory about,
        string memory role
    ) public {
        profiles[msg.sender] = Profile(name, phoneNumber1, phoneNumber2, email, about, role);
        emit ProfileCreated(msg.sender, role);
    }

    function createTender(string memory description, uint256 deadline, uint256 minBidAmount) public {
        require(deadline > block.timestamp, "Deadline must be in the future.");
        tenders[nextTenderId] = Tender(description, deadline, minBidAmount, false, false, msg.sender, address(0));
        emit TenderCreated(nextTenderId, msg.sender);
        nextTenderId++;
    }

    function cancelTender(uint256 tenderId) public onlyIssuer(tenderId) onlyBeforeDeadline(tenderId) {
        require(!tenders[tenderId].isClosed, "Tender is already closed.");
        tenders[tenderId].isCancelled = true;
        
        for (uint256 i = 0; i < tenderBids[tenderId].length; i++) {
            payable(tenderBids[tenderId][i].bidder).transfer(tenderBids[tenderId][i].amount);
        }
        emit TenderCancelled(tenderId);
    }

    function closeTender(uint256 tenderId) public onlyIssuer(tenderId) onlyAfterDeadline(tenderId) {
        require(!tenders[tenderId].isClosed, "Tender is already closed.");
        require(!tenders[tenderId].isCancelled, "Tender has been cancelled.");
        uint256 highestBid = 0;
        address winningBidder;
        for (uint256 i = 0; i < tenderBids[tenderId].length; i++) {
            if (tenderBids[tenderId][i].amount > highestBid) {
                highestBid = tenderBids[tenderId][i].amount;
                winningBidder = tenderBids[tenderId][i].bidder;
                tenderBids[tenderId][i].isWinningBid = true;
            }
        }
        tenders[tenderId].winningBidder = winningBidder;
        tenders[tenderId].isClosed = true;
        emit TenderClosed(tenderId, winningBidder, highestBid);
    }

    function submitBid(uint256 tenderId) public payable onlyBeforeDeadline(tenderId) {
        require(!tenders[tenderId].isClosed, "Tender is closed.");
        require(!tenders[tenderId].isCancelled, "Tender is cancelled.");
        require(msg.value >= tenders[tenderId].minBidAmount, "Bid amount is too low.");
        tenderBids[tenderId].push(Bid(msg.sender, msg.value, false));
        emit BidSubmitted(tenderId, msg.sender, msg.value);
    }

    function withdrawBid(uint256 tenderId) public onlyBeforeDeadline(tenderId) {
        require(!tenders[tenderId].isClosed, "Tender is closed.");
        require(!tenders[tenderId].isCancelled, "Tender is cancelled.");
        Bid[] storage bids = tenderBids[tenderId];
        for (uint256 i = 0; i < bids.length; i++) {
            if (bids[i].bidder == msg.sender) {
                payable(msg.sender).transfer(bids[i].amount);
                delete bids[i];
                emit BidWithdrawn(tenderId, msg.sender);
                return;
            }
        }
    }

    function confirmDelivery(uint256 tenderId) public onlyIssuer(tenderId) {
        require(tenders[tenderId].isClosed, "Tender must be closed.");
        require(tenders[tenderId].winningBidder != address(0), "No winning bidder.");
        address payable winningBidder = payable(tenders[tenderId].winningBidder);
        uint256 amount = tenderBids[tenderId][0].amount;
        for (uint256 i = 0; i < tenderBids[tenderId].length; i++) {
            if (tenderBids[tenderId][i].isWinningBid) {
                amount = tenderBids[tenderId][i].amount;
                break;
            }
        }
        winningBidder.transfer(amount);
        emit DeliveryConfirmed(tenderId, msg.sender, winningBidder);
    }

    function imposePenalty(uint256 tenderId, uint256 penaltyAmount) public onlyIssuer(tenderId) {
        require(tenders[tenderId].isClosed, "Tender must be closed.");
        require(tenders[tenderId].winningBidder != address(0), "No winning bidder.");
        address payable winningBidder = payable(tenders[tenderId].winningBidder);
        require(penaltyAmount <= address(this).balance, "Penalty amount exceeds contract balance.");
        winningBidder.transfer(penaltyAmount);
        emit PenaltyImposed(tenderId, winningBidder, penaltyAmount);
    }

    function saveTender(uint256 tenderId) public {
        savedTenders[msg.sender].push(tenderId);
        emit TenderSaved(tenderId, msg.sender);
    }

    function unsaveTender(uint256 tenderId) public {
        uint256[] storage tendersList = savedTenders[msg.sender];
        for (uint256 i = 0; i < tendersList.length; i++) {
            if (tendersList[i] == tenderId) {
                delete tendersList[i];
                emit TenderUnsaved(tenderId, msg.sender);
                return;
            }
        }
    }

    function getSavedTenders() public view returns (uint256[] memory) {
        return savedTenders[msg.sender];
    }

    function getTenderBids(uint256 tenderId) public view returns (Bid[] memory) {
        return tenderBids[tenderId];
    }

    function getBidHistory() public view returns (Bid[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextTenderId; i++) {
            for (uint256 j = 0; j < tenderBids[i].length; j++) {
                if (tenderBids[i][j].bidder == msg.sender) {
                    count++;
                }
            }
        }
        
        Bid[] memory userBids = new Bid[](count);
        count = 0;
        for (uint256 i = 0; i < nextTenderId; i++) {
            for (uint256 j = 0; j < tenderBids[i].length; j++) {
                if (tenderBids[i][j].bidder == msg.sender) {
                    userBids[count] = tenderBids[i][j];
                    count++;
                }
            }
        }
        return userBids;
    }

    function rateIssuer(address issuerAddress, uint8 rating) public {
        require(rating > 0 && rating <= 5, "Rating must be between 1 and 5.");
        issuerRatingsSum[issuerAddress] += rating;
        issuerRatingsCount[issuerAddress]++;
        emit IssuerRated(issuerAddress, rating);
    }

    function rateBidder(address bidderAddress, uint8 rating) public {
        require(rating > 0 && rating <= 5, "Rating must be between 1 and 5.");
        bidderRatingsSum[bidderAddress] += rating;
        bidderRatingsCount[bidderAddress]++;
        emit BidderRated(bidderAddress, rating);
    }

    function getIssuerRating(address issuerAddress) public view returns (uint8) {
        return issuerRatingsCount[issuerAddress] == 0 ? 0 : issuerRatingsSum[issuerAddress] / issuerRatingsCount[issuerAddress];
    }

    function getBidderRating(address bidderAddress) public view returns (uint8) {
        return bidderRatingsCount[bidderAddress] == 0 ? 0 : bidderRatingsSum[bidderAddress] / bidderRatingsCount[bidderAddress];
    }

    function toTimestamp(
        uint16 year,
        uint8 month,
        uint8 day,
        uint8 hour,
        uint8 minute,
        uint8 second
    ) public pure returns (uint256 timestamp) {
        return
            uint256(
                (year - 1970) * 365 days +
                (month - 1) * 30 days +
                (day - 1) * 1 days +
                (hour) * 1 hours +
                (minute) * 1 minutes +
                (second) * 1 seconds
            );
    }
}
