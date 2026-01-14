import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { useGetProductByIdQuery, useGetProductsQuery } from '../slices/productApiSlice';
import { useAddOrdersMutation, useGetOrdersByClientQuery, useDeleteOrdersMutation } from '../slices/ordersApiSlice';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error, refetch: refreshProduct } = useGetProductByIdQuery(useParams());
  const { data: products, isLoading: productsLoading, error: errorProducts, refetch: refetchProducts } = useGetProductsQuery();

  const { userInfo } = useSelector((state) => state.auth);
  const [addOrderCart] = useAddOrdersMutation();
  const [removeOrderCart] = useDeleteOrdersMutation();
  const { data: orders, refetch } = userInfo ? useGetOrdersByClientQuery(userInfo._id) : { data: null, refetch: () => { } };
  const [isInCart, setIsInCart] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (id && !hasFetched) {
      refreshProduct();
      refetchProducts();
      refetch();
      setHasFetched(true);
    }
  }, [id, refetchProducts, refetch, refreshProduct, hasFetched]);

  useEffect(() => {
    if (orders) {
      const foundOrder = orders.find(order => order.product.some(item => item._id === product?._id && order.status === 'pending'));
      setIsInCart(!!foundOrder);
    }
  }, [orders, product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error('Please log in to add items to your cart.', { autoClose: 2000 });
      return;
    }

    try {
      const orderData = {
        client: userInfo._id,
        product: product._id,
        total: product.price,
        status: 'pending',
      };

      await addOrderCart(orderData).unwrap();
      toast.success('Product Added To Cart Successfully', { autoClose: 2000 });
      setIsInCart(true);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Try Again In Few Seconds...', { autoClose: 2000 });
    }
  };

  const removeFromCartHandler = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error('Please log in to remove items from your cart.', { autoClose: 2000 });
      return;
    }

    try {
      const orderToRemove = orders.find(order =>
        order.product.some(item => item._id === product._id && order.status === 'pending')
      );
      if (orderToRemove) {
        await removeOrderCart({ id: orderToRemove._id }).unwrap();
        toast.success('Product Removed From Cart Successfully', { autoClose: 2000 });
        setIsInCart(false);
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Try Again In Few Seconds...', { autoClose: 2000 });
    }
  };

  const handleDownload = () => {
    navigate('/login');
  }

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error loading product details: {error?.data?.message || 'Please try again later.'}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  const filteredProducts = products ? products.filter((p) => {
    const isInSameCategory = p.category?.name === product.category?.name;

    const hasSameTag = p.tags.some(tag => product.tags.some(pTag => pTag.name === tag.name));

    return (isInSameCategory || hasSameTag) && p._id !== product._id;
  }) : [];





  
  return (

<div className="product-detail-container" style={{ maxWidth: '1200px', margin: 'auto', fontFamily: 'Roboto, sans-serif' }}>
  <br />
  <div className="product-detail" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
    {/* Left: Product Image */}
    <div className="product-image" style={{ width: '100%', height: '650px', overflow: 'hidden', position: 'relative', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${product.vendor._id}/${product.picture.split('/').pop()}`}
        alt={product.title}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'absolute',
          top: '0',
          left: '0',
          pointerEvents: 'none',
        }}
      />
      <img
        src="/WATER MARK WHENSHOOT.png"
        alt="Watermark"
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: 'absolute',
          objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />
    </div>

    {/* Right: Product Information */}
    <div className="product-infos" style={{ padding: '20px', maxWidth: '350px', fontFamily: 'Arial, sans-serif', lineHeight: '1.5', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      
      {/* Title Section with Sexy Font and Smaller Size */}
      <h1 style={{
        fontSize: '24px', 
        fontWeight: '600', 
        fontFamily: 'Playfair Display, serif', 
        color: '#333', 
        marginBottom: '15px', 
        textTransform: 'uppercase', 
        letterSpacing: '2px'
      }}>
        {product.title}
      </h1>

      {/* Price Section with Professional and Sexy Design */}
      <div style={{
        fontSize: '28px', 
        fontWeight: '700', 
        color: 'white', 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: '10px', 
        background: 'linear-gradient(45deg, #f9d423, #ff4e50)', 
        padding: '12px 25px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}>
        <span style={{ fontSize: '32px', marginRight: '10px' }}>{product.price}</span>
        <span style={{ fontSize: '16px', color: '#fff', textDecoration: 'line-through' }}>200 DH</span>
      </div>

      {/* Photography Details */}
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>Photography Details</h3>
        <p style={{ fontSize: '14px', color: '#777' }}>
          <strong>Photo Size:</strong> 5000px x 3500px <br />
          <strong>Grid:</strong> 3:2 <br />
          <strong>Format:</strong> JPEG, PNG <br />
          <strong>Photographer:</strong> {product.vendor?.firstName} {product.vendor?.lastName}
        </p>
      </div>

      {/* Cart Buttons */}
      {userInfo && userInfo.role === "1" && orders?.length > 0 && !orders.some(order => order.product.some(item => item._id === product?._id && order.status === 'completed')) && (
        <div className="product-footer" style={{ marginTop: '20px' }}>
          {isInCart ? (
            <button
              className="remove-from-cart-btn"
              onClick={removeFromCartHandler}
              style={{
                padding: '14px 30px',
                backgroundColor: '#ff4d4d',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#fff',
                borderRadius: '50px',
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e43f3f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4d4d'}
            >
              <i className="fa fa-trash" style={{ marginRight: '8px' }}></i>Remove from Cart
            </button>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={submitHandler}
              style={{
                padding: '14px 30px',
                background: 'linear-gradient(45deg, #ff8a00, #ff4b00)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#fff',
                borderRadius: '50px',
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <i className="fa fa-cart-plus" style={{ marginRight: '8px' }}></i>Add to Cart
            </button>
          )}
        </div>
      )}

      {userInfo && userInfo.role === "1" && orders?.length > 0 && orders.some(order => order.product.some(item => item._id === product?._id && order.status === 'completed')) && (
        <button
          onClick={() => navigate('/orders')}
          style={{
            padding: '14px 30px',
            backgroundColor: '#007bff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#fff',
            borderRadius: '50px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          <i className="fa fa-list" style={{ marginRight: '8px' }}></i>My Orders
        </button>
      )}

      {!userInfo && (
        <button
          onClick={() => handleDownload()}
          className="downloads"
          style={{
            padding: '14px 30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          <i className="fa fa-download" style={{ marginRight: '8px' }}></i>Download
        </button>
      )}
    </div>
  </div>


  {/* Additional Product Information */}
  <div className="product-footer" style={{ marginTop: '40px', fontSize: '16px', color: '#555' }}>
    <p><strong style={{ fontWeight: 'bold' }}>Description:</strong> {product.description}</p>
    <p><strong style={{ fontWeight: 'bold' }}>Category:</strong>
      <Link
        key={product.category._id}
        to={`/images/${product.category?.name}/category`}
        style={{ textDecoration: 'none', color: '#007BFF', marginRight: '8px', fontSize: '16px' }}>
        {product.category?.name}
      </Link>
    </p>
    <p><strong style={{ fontWeight: 'bold' }}>Region:</strong>
      <Link
        key={product.city}
        to={`/images/${product.city}/region`}
        style={{ textDecoration: 'none', color: '#007BFF', marginRight: '8px', fontSize: '16px' }}>
        {product.city}
      </Link>
    </p>
    <p>
      {product.tags && product.tags.length > 0 && (
        <>
          <strong style={{ fontWeight: 'bold' }}>Tags:</strong>  {product.tags.map(tag => (
            <Link key={tag._id} to={`/images/${tag.name}/tag`} style={{ textDecoration: 'none', color: '#007BFF', marginRight: '8px', fontSize: '16px' }}>
              #{tag.name}
            </Link>))}
        </>
      )}
    </p>
  </div>

  {/* Recommended Products */}
  <div className="recommendations-section" style={{ marginTop: '40px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Recommended Images</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              width: '200px',
              cursor: 'pointer',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <Link
              to={`/product/${product._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${product.vendor._id}/${product.picture.split('/').pop()}`}
                alt={product.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover', pointerEvents: 'none' }}
              />
              <div style={{ padding: '8px', fontSize: '14px' }}>
                <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#333', fontWeight: '500' }}>{product.title}</h3>
                <h4 style={{ fontSize: '14px', color: '#666', margin: '0' }}>{product.price} DH</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0' }}>By {product.vendor?.firstName} {product.vendor?.lastName}</p>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p style={{ fontSize: '14px', color: '#666' }}>No recommendations available.</p>
      )}
    </div>
  </div>
</div>










  );
};

export default Product;
