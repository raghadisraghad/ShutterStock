import React from 'react';
import { FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
import './Components.css';

const Footer = () => {
    return (
        <>
            <hr />
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src="../../media/icon green.png" alt="Website Logo" className="footer-logo-img" />
                        <span className="footer-brand-name">WhenShoot</span>
                    </div>

                    <div className="footer-contact">
                        <p><strong>Contact Us:</strong></p>
                        <p><FaEnvelope /> <a href="mailto:contact@whenshoot.com">contact@whenshoot.com</a></p>
                        <p><FaInstagram /> <a href="https://www.instagram.com/whenshoot" target="_blank" rel="noopener noreferrer">Instagram</a></p>
                        <p><FaFacebook /> <a href="https://www.facebook.com/whenshoot" target="_blank" rel="noopener noreferrer">Facebook</a></p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} WhenShoot. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default Footer;
