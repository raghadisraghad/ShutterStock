import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // Right arrow icon for search button
import { FaImage, FaVideo, FaHeadphones } from 'react-icons/fa'; // Import category icons
import './SearchBar.css'; // Import the updated CSS

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState('images');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${mediaType}/${searchQuery}`);
    }
  };

  return (
    <div className="moroccan-search-bar-container">
      <form onSubmit={handleSearchSubmit} className="moroccan-search-bar-form">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={handleSearchChange} 
          placeholder="Search..." 
          className="moroccan-search-input" 
        />
        <button type="submit" className="moroccan-search-icon">
          <FaArrowRight />
        </button>
      </form>

      {/* Category Icons */}
      <div className="moroccan-category-icons">
        <div 
          className={`moroccan-category-icon ${mediaType === 'images' ? 'active' : ''}`} 
          onClick={() => handleMediaTypeChange('images')}
        >
          <FaImage size={30} />
        </div>
        <div 
          className={`moroccan-category-icon ${mediaType === 'videos' ? 'active' : ''}`} 
          onClick={() => handleMediaTypeChange('videos')}
        >
          <FaVideo size={30} />
        </div>
        <div 
          className={`moroccan-category-icon ${mediaType === 'audios' ? 'active' : ''}`} 
          onClick={() => handleMediaTypeChange('audios')}
        >
          <FaHeadphones size={30} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
