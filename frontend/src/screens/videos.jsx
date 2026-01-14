import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './Products.css';
import { useGetVideosQuery } from '../slices/videoApiSlice';

const Videos = () => {
  const { search, type } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading, refetch, error } = useGetVideosQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      refetch();
      setHasFetched(true);
    }
  }, [location, refetch, hasFetched]);

  useEffect(() => {
    if (type === 'category') setCategoryFilter(search || '');
    else if (type === 'tag') setTagFilter(search || '');
    else if (type === 'region') setCityFilter(search || '');
    else setSearchQuery(search || '');
  }, [search, type]);

  if (productsLoading) return <p>Loading videos...</p>;
  if (error) return <p>Error loading videos. Please try again later.</p>;
  if (!products || products.length === 0) return <p>No products found.</p>;

  const handleProductClick = (id) => {
    navigate(`/video/${id}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setVendorFilter('');
    setTagFilter('');
    setCityFilter('');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setVendorFilter('');
    setTagFilter('');
    setCityFilter('');
  };

  let filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !categoryFilter || product.category?.name.toLowerCase() === categoryFilter.toLowerCase();

    const matchesVendor =
      !vendorFilter ||
      `${product.vendor?.firstName} ${product.vendor?.lastName}`
        .toLowerCase()
        .includes(vendorFilter.toLowerCase());

    const matchesTags =
      !tagFilter ||
      product.tags.some((tag) => tag.name.toLowerCase().includes(tagFilter.toLowerCase()));

    const matchesCity =
      !cityFilter || product.city?.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearchQuery && matchesCategory && matchesVendor && matchesTags && matchesCity;
  });

  const itemsPerPage = 16;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  filteredProducts = filteredProducts.slice(
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
      <div className="filter-container">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Videos..."
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

        {/* Filters */}
        <div className="filters">
          <div className="filter-dropdown">
            <button className="filter-text-button">Filter By</button>
            <div className="filter-options">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {products
                  .map((product) => product.category?.name)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              {/* Vendor Filter */}
              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Vendors</option>
                {products
                  .map(
                    (product) =>
                      `${product.vendor?.firstName} ${product.vendor?.lastName}`
                  )
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
              </select>

              {/* Tag Filter */}
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Tags</option>
                {products
                  .flatMap((product) => product.tags.map((tag) => tag.name))
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((tag) => (
                    <option key={tag} value={tag}>
                      #{tag}
                    </option>
                  ))}
              </select>

              {/* City Filter */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Cities</option>
                {products
                  .map((product) => product.city)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>

              {/* Reset Button */}
              <button onClick={resetFilters} className="reset-button">
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="video-gallery">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="video-gallery-item"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="video-container">
              {/* <video
                className="product-video"
                autoPlay
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
              >
                <source
                  src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-videos/${product.vendor._id}/${product.video.split('/').pop()}`}
                  type="video/mp4"
                />
                <source
                  src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-videos/${product.vendor._id}/${product.video.split('/').pop()}`}
                  type="video/webm"
                />
              </video> */}
              <img src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${product.vendor._id}/${product.picture.split('/').pop()}`} alt={product.title} className="product-video" />
              <div className="video-hover-overlay">
                <div className="video-details">
                  <h3>{product.title}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
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

export default Videos;
