import React from 'react';
import '../css/AboutProject.css';

export const AboutProject = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Our Project</h1>
      </header>
      <section className="about-content">
        <p>
          Our project is a cutting-edge decentralized e-procurement platform designed to revolutionize the traditional tendering process by leveraging the power of blockchain technology. Built with Solidity for smart contracts on the Ethereum blockchain and React for a dynamic frontend, this platform offers a robust and transparent solution for managing procurement activities.
        </p>
        <h2>Key Features:</h2>
        <ul className='key_feat'>
          <li><strong>Role-Based Access Control:</strong> Issuers and Bidders.</li>
          <li><strong>MetaMask Integration:</strong> Seamlessly connects users' MetaMask wallets for secure blockchain interactions.</li>
          <li><strong>User Profiles:</strong> Comprehensive profiles with roles, permissions, and activity history.</li>
          <li><strong>Tender Creation and Management:</strong> Effortless creation, publication, and management of tenders.</li>
          <li><strong>Bid Submission and Management:</strong> Transparent and tamper-proof bid submissions with support for multiple bidding rounds.</li>
        </ul>
        <h2>Objective:</h2>
        <p>
          This platform addresses critical challenges in traditional procurement systems, such as cost overruns, credit risks, contract enforcement issues, and process delays. By utilizing blockchain technology, it enhances transparency, reduces inefficiencies, and fosters trust among all parties involved in the procurement process.
        </p>
      </section>
    </div>
  );
};
