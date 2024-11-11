import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="left-side">
          <p className="small-text">Startup <span>BUSINESS</span></p>
          <h1 className="large-header">Make your business</h1>
          <h2 className="when-shoot">WHENSHOOT</h2>
          <p className="lorem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sollicitudin, orci et cursus euismod, odio quam cursus nunc.</p>
          <button className="get-started-btn">
            <LinkContainer to="/process">
              <a>Get Started</a>
            </LinkContainer>
          </button>
        </div>

        <div className="line"></div>

        <div className="right-side">
          <div className="logo-container">
            <img src="../../media/logo principle white.png" alt="Logo" className="logo" />
            <div className="logo-glow"></div>
          </div>
        </div>
      </div>

      <div className="logos-row">
        <img src="../../media/icon black.png" alt="Logo 1" className="logo-item" />
        <img src="../../media/icon red.png" alt="Logo 2" className="logo-item" />
        <img src="../../media/icon green.png" alt="Logo 3" className="logo-item" />
        <img src="../../media/logo principle white.png" alt="Logo 4" className="logo-item" />
        <img src="../../media/logo principle red.png" alt="Logo 5" className="logo-item" />
      </div>
    </>
  );
};

export default Home;
