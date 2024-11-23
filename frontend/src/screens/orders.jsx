import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetOrdersByClientQuery } from '../slices/ordersApiSlice';
import FormContainer from '../components/FormContainer';

const Orders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const { data: orders, isLoading, error } = useGetOrdersByClientQuery(userInfo._id);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const filteredOrders = orders?.filter((order) =>
    selectedStatus === 'All' ? true : order.status === selectedStatus
  );

  return (
    <>
      <h1>Orders</h1>
      <div className="profile-container">
        {showPopup && selectedProduct && (
          <div className="popup">
            <div className="popup-content">
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.description}</p>
              <img src={`http://localhost:5000/api/pictures/product-images/${selectedProduct.vendor}/${selectedProduct.picture.split(/[\\/]/).pop()}`} alt={selectedProduct.title} />
              <p>Type : {selectedProduct.type}</p>
              <p>Price: {selectedProduct.price} DH</p>
              <p>Vendor : {selectedProduct.vendor}</p>
              <p>Category : {selectedProduct.category}</p>
              <ul> Tags
                {selectedProduct.tags.map((tag) => (
                  <li>{tag.name}</li>
                ))}
              </ul>
              <p>Product Created The: {new Date(selectedProduct.dateCreated).toLocaleDateString()}</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}

        <div className="form-content">
          <div className="custom-form-container">
            <FormContainer>
              <div className="profileHeader">
                <div className="list"><div className="filter-container">
                  <label htmlFor="statusFilter">Filter by Status:</label>
                  <select id="statusFilter" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} >
                    <option value="All">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                  {isLoading ? (
                    <p>Loading orders...</p>
                  ) : error ? (
                    <p>Error loading orders.</p>
                  ) : Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          {userInfo.role !== '1' && <th>Client</th>}
                          <th>Product</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Date Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order._id}>
                            <td>{index + 1}</td>
                            {userInfo.role !== '1' && <td>{order.client.username}</td>}
                            <td>
                              <button onClick={() => handleProductClick(order.product[0])}>
                                {order.product[0]?.title}
                              </button>
                            </td>
                            <td>{order.status}</td>
                            <td>{order.total} DH</td>
                            <td>{new Date(order.dateCreated).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No orders available</p>
                  )}
                </div>
              </div>
            </FormContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
