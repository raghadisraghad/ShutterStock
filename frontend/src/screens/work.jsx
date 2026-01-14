import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

import { useGetWorkByIdQuery } from '../slices/workApiSlice';
import { useGetServicesByVendorQuery } from '../slices/serviceApiSlice';
import './win.css'
const WorkDetail = () => {
    const { data: work, isLoading, error } = useGetWorkByIdQuery(useParams());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (work) {
            setLoading(false);
        }
    }, [work]);
    const { data: service, isLoading: serviceLoading } = useGetServicesByVendorQuery(work?.vendor?._id);

    if (isLoading || loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <p>Error fetching work details.</p>;
    }

    return (







<div className="work-details">
  <nav aria-label="breadcrumb" className="breadcrumb-nav">
    <ol>
      <li><Link to="/" className="breadcrumb-link">Home</Link></li>
      <li className="breadcrumb-separator"> &gt; </li>
      <li><Link to="/services" className="breadcrumb-link">Services</Link></li>
      <li className="breadcrumb-separator"> &gt; </li>
      <li><Link to={`/service/${service?._id}/${service?.vendor?._id}`} className="breadcrumb-link">{service?.title}</Link></li>
      <li className="breadcrumb-separator"> &gt; </li>
      <li><Link to={`/work/${work._id}`} className="breadcrumb-link">{work.title}</Link></li>
    </ol>
  </nav>

  <div className="work-header">
    <h1 className="work-title">{work.title}</h1>
    <p className="work-description">{work.description}</p>
  </div>

  <div className="work-meta">
    <p><strong>Price: </strong><span className="highlight-text">{work.price} DH</span></p>
    <p><strong>Start Date: </strong><span className="highlight-text">{new Date(work.startDate).toLocaleDateString()}</span></p>
    <p><strong>End Date: </strong><span className="highlight-text">{new Date(work.endDate).toLocaleDateString()}</span></p>
    <p><strong>City: </strong><span className="highlight-text">{work.city}</span></p>
  </div>

  <div className="portfolio-gallery">
    <div className="image-gallery">
      {work.picture?.map((img, index) => (
        <div key={index} className="image-container">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/service-work-image/${work.vendor._id}/${img.split('/').pop()}`}
            alt={`Work ${index + 1}`}
            className="work-image"
          />
          <div className="image-overlay">
            <span className="image-caption">{work.title} - {index + 1}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="work-details-right">
      <h2 className="work-details-title">About This Work</h2>
      <p className="work-details-text">{work.description}</p>
      <div className="work-meta-details">
        <p><strong>Price: </strong>{work.price} DH</p>
        <p><strong>Start Date: </strong>{new Date(work.startDate).toLocaleDateString()}</p>
        <p><strong>End Date: </strong>{new Date(work.endDate).toLocaleDateString()}</p>
        <p><strong>City: </strong>{work.city}</p>
      </div>
    </div>
  </div>

  <div className="work-collaborators">
    <h4 className="collaborators-title">Collaborators:</h4>
    <ul className="collaborators-list">
      {work.collaborators?.map((collab, index) => (
        <li key={index} className="collaborator-item">{collab}</li>
      ))}
    </ul>
  </div>

  <div className="cta-buttons">
    <button className="cta-btn contact-btn">Contact Us</button>
    <button className="cta-btn portfolio-btn">View More Works</button>
  </div>
</div>

 

















    );
};

export default WorkDetail;
