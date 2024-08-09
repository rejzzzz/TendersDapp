import React from 'react';
import '../css/ContactUs.css';

export const ContactUs = () => {
  return (
    <div className="contact-us">
      <h1>Contact Us</h1>
      <div className="team-info">
        <h2>Team: Spell_Break</h2>
        <div className="we">
        <p><strong>Team Leader:</strong> Rejwanul</p>
        <p><strong>Backend Developer:</strong> Arnav Ranjan</p>
        <p><strong>Frontend Developer:</strong> Sai Tej</p>
        </div>
      </div>
      <div className="email-info">
        <h2>Emails:</h2>
        <p><a href="mailto:rejwanul.h23@iiits.in">rejwanul.h23@iiits.in</a></p>
        <p><a href="mailto:arnav.r23@iiits.in">arnav.r23@iiits.in</a></p>
        <p><a href="mailto:saitej.r23@iiits.in">saitej.r23@iiits.in</a></p>
      </div>
    </div>
  );
};
