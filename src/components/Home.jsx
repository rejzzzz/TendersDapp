import { useNavigate } from 'react-router-dom';
import '../css/home.css';

export const Home = () => {
    const nav = useNavigate();

    return (
        <div className="home">
            <div className="content-container">
                <h2>Welcome to the eProcurement System</h2>
                <p className='whatt'>
                    The eProcurement System of India enables Tenderers to download the Tender Schedule free of cost
                    and then submit the bids online through this portal. Experience a seamless and efficient
                    procurement process with our modern system.
                </p>
            </div>
            <button onClick={(e) => {
                e.preventDefault();
                nav('/applyTander'); // Updated route to match the naming convention
            }}>
                Apply for Tender
            </button>
        </div>
    );
};
