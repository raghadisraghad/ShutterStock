import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productApiSlice';
import './Products.css';

const Products = () => {
  const { search, type } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading, refetch } = useGetProductsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    if (!hasFetched) {
      refetch();
      setHasFetched(true);
    }
  }, [location, refetch, hasFetched]);

  useEffect(() => {
    if (type === 'category') {
      setCategoryFilter(search || '');
    } else if (type === 'tag') {
      setTagFilter(search || '');
    } else if (type === 'region') {
      setCityFilter(search || '');
    } else {
      setSearchQuery(search || '');
    }
  }, [search, type]);

  if (productsLoading) {
    return <p>Loading products...</p>;
  }

  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setVendorFilter('');
    setTagFilter('');
    setCityFilter('');
  };

  const filteredProducts = products.filter((product) => {
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
      product.tags.some((tag) =>
        tag.name.toLowerCase().includes(tagFilter.toLowerCase())
      );

    const matchesCity =
      !cityFilter || product.city?.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearchQuery && matchesCategory && matchesVendor && matchesTags && matchesCity;
  });



  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Slice the filtered products for pagination
  const currentItems = filteredProducts.slice(
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


        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Images ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the state with the input value
          />

          {/* Conditionally render the clear button only when there's a search query */}
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

        <div className="filters">
          <div className="filter-dropdown">
            <button className="filter-text-button">Filter By</button>
            <div className="filter-options">
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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

              <select
                className="filter-select"
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
              >
                <option value="">All Vendors</option>
                {products
                  .map((product) => `${product.vendor?.firstName} ${product.vendor?.lastName}`)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
              </select>

              <select
                className="filter-select"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
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

              <select
                className="filter-select"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
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
              <button onClick={resetFilters} className="reset-button">Reset Filters</button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div id="gallery" className="gallery">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="gallery-item"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="image-container">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${product.vendor._id}/${product.picture.split('/').pop()}`}
                alt={product.title}
                className="product-image"
              />
              <div className="product-hover-overlay">
                <div className="product-details">
                  <h3>{product.title}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          &larr;
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default Products;
