import React from 'react';
import './Help.css'; // Import CSS file for styling

const Help = () => {
  return (
    <div className="help-container">
      <div className="help-content">
        <h1 className="help-heading">Welcome to Our Help Page</h1>
        <p className="help-description">
          Need assistance? You've come to the right place! Below, you'll find helpful information and
          resources to address common questions and concerns.
        </p>
        <div className="help-section">
          <h2 className="help-section-heading">Frequently Asked Questions (FAQs)</h2>
          <p className="help-section-description">
            Browse through our frequently asked questions to find answers to common queries about our
            services, products, and policies.
          </p>
          <a href="#faq" className="help-link">
            Explore FAQs
          </a>
        </div>
        <div className="help-section">
          <h2 className="help-section-heading">Contact Us</h2>
          <p className="help-section-description">
            Have a specific question or issue? Feel free to reach out to our support team. We're here to
            help!
          </p>
          <a href="#contact" className="help-link">
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
