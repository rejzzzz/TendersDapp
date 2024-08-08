import { useNavigate } from "react-router-dom"
import '../css/choose.css'

export const Choose=()=>{
    const nav= useNavigate();
    
    return(
        <div className="choose-container">
        <button onClick={async(e)=>{
            e.preventDefault();
            // await axios.post(`${process.env.REACT_APP_SERVER_URL}/bidder&issuer`,{ISSUER:process.env.REACT_APP_ISSUER})
            nav('/');
            
        }}>Issuer</button>

        <button onClick={async(e)=>{
                e.preventDefault();
                // await axios.post(`${process.env.REACT_APP_SERVER_URL}/bidder_issuer`,{BIDDER:process.env.REACT_APP_BIDDER})
                nav('/');
        }}>Bidder</button>
        </div>
    )
}