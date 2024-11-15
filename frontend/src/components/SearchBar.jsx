import React, { useState } from 'react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search Query:', searchQuery);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearchSubmit} className="search-bar-form">
        <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." className="search-input" />
        <button type="submit" className="search-button"> Search </button>
      </form>
    </div>
  );
};

export default SearchBar;
