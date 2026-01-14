import React from 'react';
import { FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
    const footerStyle = {
        container: {
            background: '#fff', // Gradient background example
            color: '#333',
            borderTop: '12rem solid transparent',
            //boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)', // Subtle shadow for depth
        },
        contentWrapper: {
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
        },
        logoSection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '50%',
        },
        logoImg: {
            height: '70px',
            marginBottom: '0.8rem',
        },
        brandName: {
            fontSize: '1.6rem',
            fontWeight: '700',
            color: '#33cc66',
            margin: 0,
        },

        Name: {
            fontSize: '1.09rem',
            fontWeight: '700',
            color: '#33cc66',
            margin: 0,
        },
        aboutText: {
            marginTop: '0.5rem',
            fontSize: '0.95rem',
            color: '#666',
            lineHeight: '1.6',
        },
        footerContact: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            maxWidth: '40%',
            alignItems: 'flex-start',
        },
        contactText: {
            fontSize: '1.1rem',
            marginBottom: '1rem',
            fontWeight: '600',
        },
        contactLink: {
            color: '#333',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'color 0.3s ease',
        },
        contactLinkHover: {
            color: '#2a9d8f',
        },
        socialIcons: {
            display: 'flex',
            gap: '1.2rem',
            marginTop: '1.5rem',
            justifyContent: 'center',
        },
        icon: {
            fontSize: '1.8rem',
            color: '#333',
            backgroundColor: '#fff',
            padding: '8px',
            borderRadius: '50%',
            border: '1px solid #ddd',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
        },
        iconHover: {
            backgroundColor: '#2a9d8f',
            transform: 'scale(1.1)',
        },
        bottom: {
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: '#aaa',
        },
    };

    return (
        <footer style={footerStyle.container}>
            <div style={footerStyle.contentWrapper}>
                {/* Logo Section */}
                <div style={footerStyle.logoSection}>
                    <img
                        src="/icon green.png"
                        alt="WhenShoot Logo"
                        style={footerStyle.logoImg}
                    />
                    <h2 style={footerStyle.brandName}>WhenShoot</h2>
                    <p style={footerStyle.aboutText}>
                        WhenShoot is your premier Moroccan platform for stunning photography,
                        bringing you authentic visuals with global appeal. Empowering creators
                        and businesses alike.
                    </p>
                </div>

                {/* Contact Section */}
                <div style={footerStyle.footerContact}>
                    <h4 style={footerStyle.Name}>Contact Us</h4>
                    <br />
                    <p>
                        <FaEnvelope style={{ marginRight: '10px' }} />
                        <a
                            href="mailto:contact@whenshoot.com"
                            style={footerStyle.contactLink}
                            onMouseOver={(e) =>
                                (e.target.style.color = footerStyle.contactLinkHover.color)
                            }
                            onMouseOut={(e) =>
                                (e.target.style.color = footerStyle.contactLink.color)
                            }
                        >
                            contact@whenshoot.com
                        </a>
                    </p>
                    <p>
                        <FaInstagram style={{ marginRight: '10px' }} />
                        <a
                            href="https://www.instagram.com/whenshoot"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={footerStyle.contactLink}
                            onMouseOver={(e) =>
                                (e.target.style.color = footerStyle.contactLinkHover.color)
                            }
                            onMouseOut={(e) =>
                                (e.target.style.color = footerStyle.contactLink.color)
                            }
                        >
                            Instagram
                        </a>
                    </p>
                    <p>
                        <FaFacebook style={{ marginRight: '10px' }} />
                        <a
                            href="https://www.facebook.com/whenshoot"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={footerStyle.contactLink}
                            onMouseOver={(e) =>
                                (e.target.style.color = footerStyle.contactLinkHover.color)
                            }
                            onMouseOut={(e) =>
                                (e.target.style.color = footerStyle.contactLink.color)
                            }
                        >
                            Facebook
                        </a>
                    </p>
                </div>
            </div>

            {/* Footer Bottom */}
            <div style={footerStyle.bottom}>
                <p>© {new Date().getFullYear()} WhenShoot. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
