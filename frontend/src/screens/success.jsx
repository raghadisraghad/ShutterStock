import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { useUpdateOrdersMutation } from '../slices/ordersApiSlice';
import { useUpdateUserMutation, useGetUserQuery } from '../slices/userApiSlice';
import './success.css'

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [updateOrder] = useUpdateOrdersMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleViewOrder = () => {
    navigate('/orders');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const updateOrders = async () => {
      try {
        const selectedProductsForPayment = JSON.parse(localStorage.getItem('selectedProductsForPayment'));

        if (!selectedProductsForPayment || selectedProductsForPayment.length === 0) {
          throw new Error('No selected products for payment found.');
        }

        for (const order of selectedProductsForPayment) {
          let updatedOrderData = {
            client: order.client,
            total: order.total,
            status: 'completed',
            archive: order.archive,
          };

          let response = '';
          let userId = '';
          if (order.product && order.product.length > 0) {
            updatedOrderData.product = order.product[0];
            userId = order.product[0].vendor;
          } else if (order.video && order.video.length > 0) {
            updatedOrderData.video = order.video[0];
            userId = order.video[0].vendor;
          } else if (order.audio && order.audio.length > 0) {
            updatedOrderData.audio = order.audio[0];
            userId = order.audio[0].vendor;
          } else {
            throw new Error('No valid product, video, or audio found in the order.');
          }

          response = await fetch(`/api/client/${userId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch vendor data for userId: ${userId}`);
          }

          const vendor = await response.json();
          if (!vendor || !vendor.sold) {
            throw new Error(`Invalid vendor data received for userId: ${userId}`);
          }

          const sold = vendor.sold + order.total;
          const updateData = { sold };

          await updateOrder({ id: order._id, ...updatedOrderData }).unwrap();
          await updateUser({ id: userId, data: updateData }).unwrap();
          localStorage.removeItem('selectedProductsForPayment');
        }

        navigate('/orders');

      } catch (error) {
        console.error('Error updating order:', error);
        alert(`Error: ${error.message}`);
      }
    };

    updateOrders();
  }, [updateOrder]);

  return (
    <div className="success-container">
      <h1>Payment Successful!</h1>
      <p>Your payment has been processed successfully.</p>
      <button onClick={handleViewOrder} className="btn">See My Order</button>
      <button onClick={handleGoHome} className="btn">Go to Home Page</button>
    </div>
  );
};

export default Success;
