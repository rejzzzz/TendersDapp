import { Link, Outlet, useNavigate } from "react-router-dom"
import '../css/layout.css'
import { useEffect } from "react";
import { ethers } from "ethers";

export const Layout=()=>{
    const nav=useNavigate();

    useEffect(()=>{
        const verification= async()=>{
            
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
        <Link to={'/contactUs'}>📱Contact US</Link>
        <Link to={'/aboutProject'}>📄About Project</Link>
    </nav>
    <Outlet/>
    </>
    )};