import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="left-side">
          <p>Startup <span>BUSINESS</span></p>
          <h1>Make your business</h1>
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

      <div className="searchBar">
      </div>
    </>
  );
};

export default Home;
