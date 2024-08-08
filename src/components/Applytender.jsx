import { useState } from "react";
import '../css/error&success.css'

export const Applytender=()=>{
    const [error,setError]=useState()
    const [formData, setFormData] = useState({
        tenderName: '',
        tenderAmount: '',
        tenderDueDate: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
      const handleSubmit = async(e) => {
        e.preventDefault();
        try{
        // await axios.post(`${process.env.REACT_APP_SERVER_URL}/applyTander`,{formData});
        setError('✅ tender applied');
        }catch(err){
            setError(err.response.data);
        }
      }

    return(
        <>
        {error && <p id={error!=='✅ tender applied'?"error":"success"}>
        {error !== '✅ tender applied' ? `Error: ${error}` : error}</p>}
        <form onSubmit={handleSubmit}>
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
          <label htmlFor="tenderAmount">Tender Amount</label>
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

        <button type="submit">Submit</button>
      </form>
      </>
    )
}