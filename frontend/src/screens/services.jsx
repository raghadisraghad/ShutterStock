import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useGetServicesQuery } from '../slices/serviceApiSlice';
import './Products.css';
import './s.css';

const Services = () => {
  const navigate = useNavigate();
  const { search, type } = useParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (type === 'region') {
      setCityFilter(search || '');
    } else {
      setSearchQuery(search || '');
    }
  }, [search, type]);

  const { data: services, isLoading, error } = useGetServicesQuery();

  // Filter the services based only on the search query and city filter
  let filteredServices = services?.filter((service) => {
    const matchesSearchQuery =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = !cityFilter || service.city?.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearchQuery && matchesCity;
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong!</h1>;

  const handleServiceClick = (serviceId, vendorId) => {
    navigate(`/service/${serviceId}/${vendorId}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCityFilter('');
  };

  // Reset only the city filter
  const resetFilters = () => {
    setSearchQuery('');
    setCityFilter('');
  }; const itemsPerPage = 16;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  filteredServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="filter-container">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the state with the input value
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="clear-button"
              aria-label="Clear Search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters Section */}
        <div className="filters">
          <div className="filter-dropdown">
            <button className="filter-text-button">Filter By</button>
            <div className="filter-options">
              {/* City Filter */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Cities</option>
                {services
                  ?.map((service) => service.city)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>

              {/* Reset Filters Button */}
              <button onClick={resetFilters} className="reset-button">
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display filtered services */}
      <div className="d-flex flex-wrap justify-content-center">
        {filteredServices && filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Card
              key={service._id}
              style={{ width: '300px', margin: '10px', cursor: 'pointer' }}
              onClick={() => handleServiceClick(service._id, service.vendor._id)}
            >
                      {/* Moroccan Culture Section 

              <Card.Img
                variant="top"
                src={service.background && service.background.length > 0
                  ? `${import.meta.env.VITE_API_BASE_URL}api/pictures/service-image/${service.vendor._id}/${service.background.split('/').pop()}`
                  : 'https://via.placeholder.com/300'}
                onContextMenu={(e) => e.preventDefault()}
              />

                          */}


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



              <Card.Body>
                <Card.Title>{service?.vendor?.firstName} {service?.vendor?.lastName}</Card.Title>
                        {/* Moroccan Culture Section 
                          <Card.Text>{service.description}</Card.Text>*/}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No services found</p>
        )}
      </div>
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous Page" >
          &larr;
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} ria-label="Next Page" >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default Services;
