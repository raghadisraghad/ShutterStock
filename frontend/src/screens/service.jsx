import React from 'react';
import { Card } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaGlobe } from 'react-icons/fa';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Add icons

import { useGetServiceByIdQuery } from '../slices/serviceApiSlice';
import { useGetWorksByVendorQuery } from '../slices/workApiSlice';
import './service.css'
const Service = () => {
  const navigate = useNavigate();

  const { data: services, isLoading: serviceLoading } = useGetServiceByIdQuery(useParams());
  const service = Array.isArray(services) ? services[0] : services;
  const { data: works, isLoading: worksLoading } = useGetWorksByVendorQuery(useParams().vendor);
  console.log("Works data:", Service);

  if (serviceLoading || worksLoading) {
    return <p>Loading...</p>;
  }

  const handleMaterialClick = (material) => {
    navigate(`/search?query=${material}`);
  };
  

  return (
    <div className="profile-page-container">
      {/* Background and Avatar */}
      <div style={{ height: '300px', position: 'relative' }}>
        <img
          src={
            service?.background
              ? `${import.meta.env.VITE_API_BASE_URL}api/pictures/service-image/${service.vendor._id}/${service.background.split('/').pop()}`
              : 'https://via.placeholder.com/1500'
          }
          alt="Service Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onContextMenu={(e) => e.preventDefault()}
        />
        <div
          style={{
            position: 'absolute',
            top: '180px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '5px solid white',
            overflow: 'hidden',
          }}
        >
          <img
            src={
              service?.vendor?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}api/pictures/avatar/${service.vendor._id}/${service.vendor.avatar.split('/').pop()}`
                : 'https://via.placeholder.com/150'
            }
            alt="Vendor Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
      
      {/* Profile Information */}
      <div className="profile-details-container">
        {/* Vendor Name */}
        <div className="vendor-name-container">
          <h2 className="vendor-name">
            {service?.vendor?.firstName} {service?.vendor?.lastName}
          </h2>
        </div>

        {/* Contact Information */}
        <div className="contact-info-container">
          <div className="contact-left-column">
            <div className="contact-item">
              <a href={`mailto:${service?.vendor?.email}`} className="contact-link">
                <FaEnvelope size={20} />
                <span className="contact-text"> {service?.vendor?.email}</span>
              </a>
            </div>
            <div className="contact-item">
              <a href={`tel:${service?.vendor?.tel}`} className="contact-link">
                <FaPhone size={20} />
                <span className="contact-text"> {service?.vendor?.tel}</span>
              </a>
            </div>
            <div className="contact-item">
              <a
                href={`https://www.google.com/maps/search/?q=${service?.city}, ${service?.local}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <FaMapMarkerAlt size={20} />
                <span className="contact-text">{service?.city}, {service?.local}</span>
              </a>
            </div>
          </div>
          <br></br>

          {/* Social Media Links */}
          <div className="social-media-container">
            {service?.vendor?.instagram && (
              <a href={service.vendor.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} className="social-media-icon instagram" />
              </a>
            )}
            {service?.vendor?.linkedin && (
              <a href={service.vendor.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} className="social-media-icon linkedin" />
              </a>
            )}
            {service?.vendor?.facebook && (
              <a href={service.vendor.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} className="social-media-icon facebook" />
              </a>
            )}
            {service?.vendor?.x && (
              <a href={service.vendor.x} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={30} className="social-media-icon twitter" />
              </a>
            )}
            {service?.vendor?.youtube && (
              <a href={service.vendor.youtube} target="_blank" rel="noopener noreferrer">
                <FaYoutube size={30} className="social-media-icon youtube" />
              </a>
            )}
            {service?.vendor?.website && (
              <a href={service.vendor.website} target="_blank" rel="noopener noreferrer">
                <FaGlobe size={30} className="social-media-icon website" />
              </a>
            )}
          </div>
        </div>
<br></br>
        {/* Materials Used Section */}
        
        
        
  <div className="materials-section">
  <h3 className="works-gallery-title">Materials Used </h3>

  <ul className="materials-list">
    {service?.vendor?.materials?.length ? (
      service.vendor.materials.map((material, index) => (
        <li key={index} className="material-item">
          <button
            className="material-bubble"
            onClick={() => handleMaterialClick(material)}
          >
            {material}
          </button>
        </li>
      ))
    ) : (
      <p>No materials listed</p>
    )}
  </ul>
</div>




        {/* Service Title and Description */}
        <br></br><br></br>
        <h3 className="works-gallery-title">{service?.title} </h3>


        <p className="service-description">Service Description: {service?.description}</p>
      </div>
      <br></br>
      {/* Works Gallery */}
      <div className="works-gallery">
        <h3 className="works-gallery-title">Portfolio </h3>
        {works?.map((work) => (
          <div
            key={work._id}
            className="work-card"
            onClick={() => navigate(`/work/${work._id}`)}
          >
            <img
              className="work-image"
              src={
                work.picture?.length
                  ? `${import.meta.env.VITE_API_BASE_URL}api/pictures/service-work-image/${work.vendor._id}/${work.picture[0].split('/').pop()}`
                  : 'https://via.placeholder.com/300'
              }
              alt={work.title}
            />
            <div className="work-card-body">
              <h4 className="work-title">{work.title}</h4>
              <p className="work-description">{work.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    






  );
};

export default Service;
