import { useState } from "react";
import '../css/error&success.css'
import '../css/applytender.css'
import tenderContractABI from '../abis/TenderContract.json'
import { ethers } from 'ethers'

export const Applytender=()=>{
    const [error,setError]=useState()
    const [formData, setFormData] = useState({
        tenderDesc:'',
        tenderName: '',
        tenderAmount: '',
        tenderDueDate: ''
      });
    
      const [milestones, setMilestones] = useState([]);
      const [newMilestone, setNewMilestone] = useState({ milestoneId: '', amount: '', isCompleted: false });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };


  const handleAddMilestone = () => {
    setMilestones([...milestones, newMilestone]);
    setNewMilestone({ milestoneId: '', amount: '', isCompleted: false });
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

      const handleSubmit = async(e) => {
        e.preventDefault();
        try{
        // await axios.post(`${process.env.REACT_APP_SERVER_URL}/applyTander`,{formData});
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tenderContractABI, process.env.REACT_APP_CONTRACTABI, signer);
      
      const milestonesFormatted = milestones.map(m => [
        m.milestoneId,
        ethers.parseEther(m.amount),
        m.isCompleted
      ]);

      const now = new Date();

      const hour = Number(now.getHours());
      const minute = Number(now.getMinutes());
      const second = Number(now.getSeconds());
          console.log(hour,minute,second);
          
          let year=Number(formData.tenderDueDate.split('-')[0]);
          let day=Number(formData.tenderDueDate.split('-')[2]);
          let month=Number(formData.tenderDueDate.split('-')[1]);
          let minBidAmount=formData.tenderAmount;
          const tx = await contract.createTender(formData.tenderDesc, year, month, day, hour, minute, second, minBidAmount, milestonesFormatted);
    await tx.wait();
        setError('✅ tender applied');
        }catch(err){
          console.log(err);
          
            // setError(err.response.data);
        }
      }

    return(
        <>
        {error && <p id={error!=='✅ tender applied'?"error":"success"}>
        {error !== '✅ tender applied' ? `Error: ${error}` : error}</p>}
        <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="tenderName">Tender Description</label>
          <textarea
            type="text"
            id="tenderDesc"
            name="tenderDesc"
            value={formData.tenderDesc}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tenderName">Tender Name</label>
          <input
            type="text"
            id="tenderName"
            name="tenderName"
            value={formData.tenderName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tenderAmount">Min Bid Amount</label>
          <input
            type="number"
            id="tenderAmount"
            name="tenderAmount" 
            value={formData.tenderAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tenderDueDate">Tender Due Date</label>
          <input
            type="date"
            id="tenderDueDate"
            name="tenderDueDate"
            value={formData.tenderDueDate}
            onChange={handleChange}
            required
          />
        </div>

        <h2>Milestones</h2>
        {milestones.map((milestone, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
            <p>Milestone ID: {milestone.milestoneId}</p>
            <p>Amount: {milestone.amount}</p>
            <p>Completed: {milestone.isCompleted ? 'Yes' : 'No'}</p>
            <button onClick={() => handleRemoveMilestone(index)}>Remove</button>
          </div>
        ))}
        
          <h3>Add New Milestone</h3>
          <div>
            <label>Milestone ID:</label>
            <input type="number" value={newMilestone.milestoneId} onChange={(e) => setNewMilestone({ ...newMilestone, milestoneId: e.target.value })} />
          </div>
          <div>
            <label>Amount:</label>
            <input type="text" value={newMilestone.amount} onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })} />
          </div>
          <div>
            <label>Completed:</label>
            <input type="checkbox" checked={newMilestone.isCompleted} onChange={(e) => setNewMilestone({ ...newMilestone, isCompleted: e.target.checked })} />
          </div>
          <button onClick={handleAddMilestone}>Add Milestone</button>

        <button type="submit">Submit</button>
      </form>
      </>
    )
}