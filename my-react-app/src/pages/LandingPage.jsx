import React from 'react';

import Courses from '../components/Courses';
import ContactForm from '../components/ContactForm';
import "./App.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="navbar">
        
          <img
            src="logo.png"
            alt="Logo"
            className="logo"
          />
        
      </header>

      <main className="hero-section">
        <div className="overlay">
          <div className="hero-content">
            <h1>Improve your skills on your own</h1>
            <h1>To prepare for a better future</h1>
            <button className='btn'>REGISTER NOW</button>
          </div>
        </div>
      </main>
      <Courses></Courses>
      <ContactForm></ContactForm>

    </div>
  );
};

export default LandingPage;