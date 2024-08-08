import { useState } from 'react';
import '../css/home.css'
import { useNavigate } from 'react-router-dom';

export const Home=()=>{
    const nav=useNavigate();

    // const [data,setData]=useState([]);
    // setData( [
    //     { id: 1, name: 'John Doe', age: 28 },
    //     { id: 2, name: 'Jane Smith', age: 34 },
    //     { id: 3, name: 'Sam Johnson', age: 45 },
    //   ]);
    const data=[
        { id: 1, name: 'John Doe', age: 28 },
        { id: 2, name: 'Jane Smith', age: 34 },
        { id: 3, name: 'Sam Johnson', age: 45 }]
    return(
    <div className="home">
    <div>
    <h2 style={{color:'blue'}}>Welcome to eProcurement System</h2>
The eProcurement System of India enables the Tenderers to download the Tender Schedule free of cost and then submit the bids online through this portal.
</div>
<div><button onClick={(e)=>{
    e.preventDefault();
    nav('/applyTander');
}}>Apply for tender</button></div>
</div>
    );
}