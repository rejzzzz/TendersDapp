// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract EProcurement {
    struct Tender {
        uint id;
        address issuer;
        string description;
        uint deadline;
        uint minBidAmount;
        bool isOpen;
        address winningBidder;
        uint winningBid;
        bool isCancelled;
        bool isDelivered;
    }

    struct Bid {
        uint tenderId;
        address bidder;
        uint amount;
        bool withdrawn;
    }

    uint public tenderCount;
    mapping(uint => Tender) public tenders;
    mapping(uint => Bid[]) public tenderBids;
    mapping(address => uint) public penalties;

    event TenderCreated(uint id, address issuer, string description, uint deadline, uint minBidAmount);
    event BidSubmitted(uint tenderId, address bidder, uint amount);
    event BidWithdrawn(uint tenderId, address bidder, uint amount);
    event TenderClosed(uint id, address winningBidder, uint winningBid);
    event TenderCancelled(uint id);
    event DeliveryConfirmed(uint id);
    event PenaltyImposed(address bidder, uint amount);

    function createTender(string memory _description, uint _deadline, uint _minBidAmount) public {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        tenderCount++;
        tenders[tenderCount] = Tender(
            tenderCount,
            msg.sender,
            _description,
            _deadline,
            _minBidAmount,
            true,
            address(0),
            0,
            false,
            false
        );

        emit TenderCreated(tenderCount, msg.sender, _description, _deadline, _minBidAmount);
    }

    function submitBid(uint _tenderId) public payable {
        require(tenders[_tenderId].isOpen, "Tender is not open for bidding");
        require(!tenders[_tenderId].isCancelled, "Tender has been cancelled");
        require(block.timestamp <= tenders[_tenderId].deadline, "Tender deadline has passed");
        require(msg.value >= tenders[_tenderId].minBidAmount, "Bid amount is too low");

        tenderBids[_tenderId].push(Bid(_tenderId, msg.sender, msg.value, false));

        emit BidSubmitted(_tenderId, msg.sender, msg.value);
    }

    function withdrawBid(uint _tenderId) public {
        Bid[] storage bids = tenderBids[_tenderId];
        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].bidder == msg.sender && !bids[i].withdrawn) {
                require(tenders[_tenderId].isOpen, "Tender is closed, cannot withdraw");
                payable(msg.sender).transfer(bids[i].amount);
                bids[i].withdrawn = true;

                emit BidWithdrawn(_tenderId, msg.sender, bids[i].amount);
                return;
            }
        }
        revert("No active bid found for the bidder on this tender");
    }

    function closeTender(uint _tenderId) public {
        Tender storage tender = tenders[_tenderId];
        require(msg.sender == tender.issuer, "Only the issuer can close the tender");
        require(tender.isOpen, "Tender is already closed");
        require(block.timestamp > tender.deadline, "Tender deadline has not passed");
        require(!tender.isCancelled, "Tender has been cancelled");

        uint highestBid = 0;
        address highestBidder;

        for (uint i = 0; i < tenderBids[_tenderId].length; i++) {
            if (tenderBids[_tenderId][i].amount > highestBid && !tenderBids[_tenderId][i].withdrawn) {
                highestBid = tenderBids[_tenderId][i].amount;
                highestBidder = tenderBids[_tenderId][i].bidder;
            }
        }

        tender.isOpen = false;
        tender.winningBidder = highestBidder;
        tender.winningBid = highestBid;

        payable(tender.issuer).transfer(highestBid);

        emit TenderClosed(_tenderId, highestBidder, highestBid);
    }

    function cancelTender(uint _tenderId) public {
        Tender storage tender = tenders[_tenderId];
        require(msg.sender == tender.issuer, "Only the issuer can cancel the tender");
        require(tender.isOpen, "Tender is already closed");

        tender.isCancelled = true;
        tender.isOpen = false;

        // Refund all active bids
        for (uint i = 0; i < tenderBids[_tenderId].length; i++) {
            if (!tenderBids[_tenderId][i].withdrawn) {
                payable(tenderBids[_tenderId][i].bidder).transfer(tenderBids[_tenderId][i].amount);
                tenderBids[_tenderId][i].withdrawn = true;
            }
        }

        emit TenderCancelled(_tenderId);
    }

    function confirmDelivery(uint _tenderId) public {
        Tender storage tender = tenders[_tenderId];
        require(msg.sender == tender.issuer, "Only the issuer can confirm delivery");
        require(!tender.isOpen, "Tender must be closed before confirming delivery");
        require(tender.winningBidder != address(0), "No winning bidder to confirm delivery");

        tender.isDelivered = true;

        emit DeliveryConfirmed(_tenderId);
    }

    function imposePenalty(address _bidder, uint _amount) public {
        require(_amount > 0, "Penalty amount must be greater than zero");

        penalties[_bidder] += _amount;

        emit PenaltyImposed(_bidder, _amount);
    }

    function getTenderBids(uint _tenderId) public view returns (Bid[] memory) {
        return tenderBids[_tenderId];
    }

    function getPenalty(address _bidder) public view returns (uint) {
        return penalties[_bidder];
    }
}