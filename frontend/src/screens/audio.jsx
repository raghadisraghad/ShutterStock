import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';

import { useGetAudiosQuery } from '../slices/audioApiSlice';
import { useAddOrdersMutation, useGetOrdersByClientQuery, useDeleteOrdersMutation } from '../slices/ordersApiSlice';
import './Products.css';

const Audio = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { search, type } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading, refetch: refetchAudios } = useGetAudiosQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [addOrderCart] = useAddOrdersMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const [removeOrderCart] = useDeleteOrdersMutation();
  const location = useLocation();
  const { data: orders, refetch } = userInfo ? useGetOrdersByClientQuery(userInfo._id) : { data: null, refetch: () => { } };
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      refetchAudios();
      setHasFetched(true);
    }
  }, [location, refetchAudios, hasFetched]);

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
    return <p>Loading audios...</p>;
  }

  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  const handleDownload = () => {
    navigate('/login');
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
      product.title.toLowerCase().includes(searchQuery.toLowerCase());

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

  const addToCartHandler = async (product) => {
    if (!userInfo) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const orderData = {
      client: userInfo._id,
      audio: product._id,
      total: product.price,
      status: 'pending',
    };

    try {
      await addOrderCart(orderData).unwrap();
      toast.success('Audio Added To Cart Successfully', { autoClose: 2000 });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Try Again In Few Seconds...', { autoClose: 2000 });
    }
  };

  const removeFromCartHandler = async (e, product) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error('Please log in to remove items from your cart.', { autoClose: 2000 });
      return;
    }

    try {
      const orderToRemove = orders.find(order =>
        order.audio.some(item => item._id === product._id && order.status === 'pending')
      );
      if (orderToRemove) {
        await removeOrderCart({ id: orderToRemove._id }).unwrap();
        toast.success('Audio Removed From Cart Successfully', { autoClose: 2000 });
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Try Again In Few Seconds...', { autoClose: 2000 });
    }
  };

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
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Audios ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="audio-table">
        {filteredProducts.map((product) => (
          <div key={product._id} className="audio-row">
            <div className="audio-left">
              {console.log(`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${product.vendor._id}/${product.picture.split('/').pop()}`)}
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${product.vendor._id}/${product.picture.split('/').pop()}`}
                alt={product.title}
                className="audio-img"
              />
            </div>

            <div className="audio-middle">
              <h2 className="audio-title">{product.title}</h2>
              <p className="audio-vendor">By {product.vendor.username}</p>

              <div className="audio-player-container">
                <audio
                  controls
                  className="audio-player"
                  controlsList="nodownload"
                  onPlay={(e) => {
                    const audio = e.target;
                    // setTimeout(() => {
                    //   audio.pause();
                    //   audio.currentTime = 0;
                    // }, 15000);
                  }}
                >
                  <source
                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${product.vendor._id}/${product.audio?.split('/').pop()}`}
                    type="audio/mp3"
                  />
                  <source
                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${product.vendor._id}/${product.audio?.split('/').pop()}`}
                    type="audio/ogg"
                  />
                  <source
                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${product.vendor._id}/${product.audio?.split('/').pop()}`}
                    type="audio/mp4"
                  />
                  <source
                    src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-audios/${product.vendor._id}/${product.audio?.split('/').pop()}`}
                    type="audio/mpeg"
                  />
                </audio>
              </div>

            </div>

            <div className="audio-right">
              <h4 className="audio-price">{product.price.toFixed(2)} DH</h4>
              <div className="audio-actions">
                {userInfo && userInfo.role === "1" && !orders.some(order => order.audio.some(item => item._id === product?._id && order.status === 'completed')) && (
                  <div className="audio-cart-actions">
                    {!orders.some(order =>
                      order.audio.some(item => item._id === product?._id && order.status === 'pending')
                    ) ? (
                      <button
                        onClick={() => addToCartHandler(product)}
                        className="audio-add-to-cart"
                      >
                        <i className="fa fa-cart-plus"></i> Add to Cart
                      </button>
                    ) : (
                      <button
                        className="audio-remove-from-cart"
                        onClick={(e) => removeFromCartHandler(e, product)}
                      >
                        <i className="fa fa-cart-arrow-down"></i> Remove From Cart
                      </button>
                    )}
                  </div>
                )}

                {userInfo && userInfo.role === "1" && orders.some(order => order.audio.some(item => item._id === product?._id && order.status === 'completed')) && (
                  <button onClick={() => navigate('/orders')} className="audio-my-orders-btn">
                    My Orders
                  </button>
                )}
                {!userInfo && (
                  <button
                    onClick={() => handleDownload()}
                    className='downloads'
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    onMouseDown={(e) => e.target.style.backgroundColor = '#3e8e41'}
                    onMouseUp={(e) => e.target.style.backgroundColor = '#45a049'}
                  >
                    Download
                  </button>
                )}
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

export default Audio;
