import { Link, Outlet, useNavigate } from "react-router-dom"
import '../css/layout.css'
import { useEffect } from "react";
import { ethers } from "ethers";

export const Layout=()=>{
    const nav=useNavigate();
//     const [choosVerified,setChoosverified]=useState(false);
    
//     useEffect(()=>{
    //     const verification= async()=>{
    //         try {
    //             // await axios.get(`${process.env.REACT_APP_SERVER_URL}/choosing`,{withCredentials:true});

    //             setChoosverified(true);
    //         } catch (error) {
    //             nav("/choose");
    //         }
    //     };
    //     verification();
    // },[nav]);

    useEffect(()=>{
        const verification= async()=>{
        // await axios.get(`${process.env.REACT_APP_SERVER_URL}/verify`,{withCredentials:true});

            
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
         } catch (error) {
              console.error('User denied access to MetaMask:', error);
            }
      }
      else alert('MetaMask not detected. Please install it.');
    }
    

    verification();
    },[nav]);

    return(
    <>
    <nav>
        <div className="logo">🏦</div>
        <Link to={'/'}>🏠Home</Link>
        <Link>📱Contact US</Link>
        <Link>📄About US</Link>
    </nav>
    <Outlet/>
    </>
    )};