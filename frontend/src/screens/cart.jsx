import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js'

import './cart.css';
import { useGetOrdersByClientQuery, useDeleteOrdersMutation } from '../slices/ordersApiSlice';
import { useAddPaymentMutation } from '../slices/stripeApiSlice';
import FormContainer from '../components/FormContainer';
import { FaTrashAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // import icons

const Cart = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedProductsForPayment, setSelectedProductsForPayment] = useState([]);

  const { data: orders, isLoading, error, refetch } = useGetOrdersByClientQuery(userInfo._id);
  const [deleteOrders] = useDeleteOrdersMutation();

  const [addPayment] = useAddPaymentMutation();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      refetch();
      setHasFetched(true);
    }
  }, [refetch, hasFetched]);

  const handleProductToggle = (order, isSelected) => {
    if (isSelected) {
      setSelectedProductsForPayment((prev) =>
        prev.filter((item) => item._id !== order._id)
      );
    } else {
      setSelectedProductsForPayment((prev) => [...prev, order]);
    }
  };

  const handleSubmitPayment = async () => {
    try {
      const stripe = await loadStripe("pk_test_51QQwirKQeybb3awT0mbbPbhChcNs1n0XtVC5sUcYzSFEIvVVxIkHYYkzI5pejFbhcQv4g5mQFujgwHFZRaFOB6Lj00mMIaSkz9");

      if (!stripe) {
        console.error('Stripe.js failed to initialize.');
        return;
      }

      const products = selectedProductsForPayment.map((item) => {
        let productData = item.video[0] || item.product[0] || item.audio[0];
        let productPicture;

        if (item.video.length > 0) {
          productPicture = "https://yourcdn.com/icons/video-icon.svg";
        } else if (item.product.length > 0) {
          productPicture = "https://yourcdn.com/icons/audio-icon.svg";
        } else if (item.audio.length > 0) {
          productPicture = "https://yourcdn.com/icons/image-icon.svg";
        }

        return {
          title: productData?.title,
          images: process.env.STORAGE_TYPE.toLowerCase() === 's3' 
            ? `https://uploads.s3.eu-west-2.wasabisys.com/${productData?.picture}` 
            : `/uploads/${productData?.picture}`,
          total: parseFloat(item.total)
        };
      });

      const { data: session, error } = await addPayment({ products: products }).unwrap();
      console.log("session:", session);

      if (error || !session || !session.id) {
        console.error('Failed to retrieve session ID.', error);
        toast.error('Payment initiation failed. Please try again.', { autoClose: 2000 });
        return;
      }

      const result = stripe.redirectToCheckout({ sessionId: session.id })

      if (result.error) {
        console.log(result.error);
        toast.error('Error in Payment', { autoClose: 2000 });
        return;
      }

      localStorage.setItem('selectedProductsForPayment', JSON.stringify(selectedProductsForPayment));

      setSelectedProductsForPayment([]);
      setPaymentTotal(0);
    } catch (error) {
      console.log("error", error);
      toast.error('Error Completing Your Payment', { autoClose: 2000 });
    }
  };

  useEffect(() => {
    const total = selectedProductsForPayment.reduce((acc, order) => acc + order.total, 0);
    setPaymentTotal(total);
  }, [selectedProductsForPayment]);

  const pendingOrders = orders?.filter((order) => order.status === 'pending');

  const handleDeleteOrder = async (orderId) => {
    try {
      const result = window.confirm("Are you sure you want to remove from cart?");
      if (!result)
        return
      await deleteOrders({ id: orderId }).unwrap();
      toast.success('Order removed from the cart!', { autoClose: 2000 });
      refetch();
    } catch (error) {
      toast.error('Error removing order from cart', { autoClose: 2000 });
    }
  };

  const handleCancel = () => {
    setSelectedProductsForPayment([]);
  }

  const getFileUrl = (filePath, vendor) => {
    return `${import.meta.env.VITE_API_BASE_URL}api/pictures/product-images/${vendor}/${filePath.split('/').pop()}`;
  };

  return (
    <>
      <div className="unique-profile-container">
        <div className="unique-form-content">
          <div className="unique-form-container">
            <h1 className="unique-section-title">My Cart</h1>
            {isLoading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p>Error loading orders.</p>
            ) : pendingOrders && pendingOrders.length > 0 ? (
              <table className="unique-order-table">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Product</th> {/* Moved "Product" column to the second position */}
                    {userInfo.role !== '1' && <th>Client</th>}
                    <th>Title</th> {/* Title column remains after the Product */}
                    <th>Total</th>
                    <th>Date Created</th>
                    <th>Select for Payment</th>
                    {!showPaymentForm && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order, index) => (
                    <tr key={order._id} className="unique-order-row">
                      <td>{index + 1}</td>
                      <td>
                        {order.product.length > 0 && (
                          <img
                            src={getFileUrl(order.product[0].picture, order.product[0].vendor)}
                            alt={order.product[0]?.title}
                            className="unique-product-image"
                          />
                        )}
                        {order.audio.length > 0 && (
                          <img
                            src={getFileUrl(order.audio[0].picture, order.audio[0].vendor)}
                            alt={order.audio[0]?.title}
                            className="unique-product-image"
                          />
                        )}
                        {order.video.length > 0 && (
                          <i className="fas fa-video"></i>
                        )}
                      </td>
                      <td>{order.product.length > 0 && order.product[0].title}</td>
                      <td>{order.total} DH</td>
                      <td>{new Date(order.dateCreated).toLocaleDateString()}</td>
                      {showPaymentForm && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProductsForPayment.some((o) => o._id === order._id)}
                            onChange={() => handleProductToggle(order, selectedProductsForPayment.some((o) => o._id === order._id))}
                            className="unique-checkbox"
                          />
                        </td>
                      )}
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProductsForPayment.some((o) => o._id === order._id)}
                          onChange={() => handleProductToggle(order, selectedProductsForPayment.some((o) => o._id === order._id))}
                          className="unique-checkbox"
                        />
                      </td>
                      {!showPaymentForm && (
                        <td>
                          <button onClick={() => handleDeleteOrder(order._id)} className="unique-remove-btn">
                            <FaTrashAlt size={20} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pending orders available</p>
            )}
          </div>
        </div>

        <div className="unique-payment-summary-container">
          <h3 className="unique-section-title">Checkout</h3>
          <button onClick={handleCancel} className="unique-payment-btn unique-cancel-btn">
            <FaTimesCircle size={18} /> Cancel Selections
          </button>
          <table className="unique-summary-table">
            <tbody>
              <tr>
                <td>Total Price:</td>
                <td>Total Products:</td>
              </tr>
              <tr>
                <td>{paymentTotal} DH</td>
                <td>{selectedProductsForPayment.length}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleSubmitPayment} className="unique-payment-btn" disabled={selectedProductsForPayment.length <= 0}>
            <FaCheckCircle size={18} /> Confirm Payment
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
