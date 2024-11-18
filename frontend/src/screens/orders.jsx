import React from 'react'
import { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col, Nav } from 'react-bootstrap';
import { redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';

const orders = () => {

  const [activeSection, setActiveSection] = useState('orders');
  const { userInfo, token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1>Orders</h1>
      <div className="profile-container">
        <div className="sidebar">
          <h5>Settings</h5>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setActiveSection('orders')} active={activeSection === 'orders'}>
              My Orders
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('cart')} active={activeSection === 'cart'}>
              My Cart
            </Nav.Link>
          </Nav>
        </div>

        <div className="form-content">
          <div className="custom-form-container">
            <FormContainer>
              <div className="profileHeader">
                {activeSection === 'orders' && (
                  <>
                    <div className="list">
                      {isLoading ? (
                        <p>Loading orders...</p>
                      ) : error ? (
                        <p>Error loading orders.</p>
                      ) : orders && orders.length > 0 && orders.status === 'done' ? (
                        orders.map((order) => (
                          <div key={order._id} className="item">
                            <h3>{order.title}</h3>
                            <p>{order.description}</p>
                            <p>Client : {order.client}</p>
                            <p>Product:</p>
                            <h3>{order.product.title}</h3>
                            <p>{order.product.description}</p>
                            <p>Type : {order.product.type}</p>
                            <p>Gallery:</p>
                            <ul>
                              {order.product.Image && order.product.Image.map((image, index) => (<li key={index}><img src="image" alt="image" /></li>))}
                            </ul>
                            <p>Tags:</p>
                            <ul>
                              {order.product.tag && order.product.tag.map((tag, index) => (<li key={index}>{tag}</li>))}
                            </ul>
                            <p>Category : {order.product.category.name}</p>
                            <p>Created the : {order.product.dateCreated}</p>
                            <p>Price: {order.product.price} DH</p>
                            <p>Created the : {order.dateCreated}</p>
                            <p>Price: {order.total} DH</p>
                          </div>
                        ))
                      ) : (
                        <p>No orders available</p>
                      )}
                    </div>
                  </>
                )}

                {userInfo.role === '1' && (
                  <>{activeSection === 'cart' && (
                    <>
                      <div className="list">
                        {isLoading ? (
                          <p>Loading orders...</p>
                        ) : error ? (
                          <p>Error loading orders.</p>
                        ) : orders && orders.length > 0 && orders.status === 'pending' ? (
                          orders.map((order) => (
                            <div key={order._id} className="item">
                              <h3>{order.title}</h3>
                              <p>{order.description}</p>
                              <p>Client : {order.client}</p>
                              <p>Product:</p>
                              <h3>{order.product.title}</h3>
                              <p>{order.product.description}</p>
                              <p>Type : {order.product.type}</p>
                              <p>Gallery:</p>
                              <ul>
                                {order.product.Image && order.product.Image.map((image, index) => (<li key={index}><img src="image" alt="image" /></li>))}
                              </ul>
                              <p>Tags:</p>
                              <ul>
                                {order.product.tag && order.product.tag.map((tag, index) => (<li key={index}>{tag}</li>))}
                              </ul>
                              <p>Category : {order.product.category.name}</p>
                              <p>Created the : {order.product.dateCreated}</p>
                              <p>Price: {order.product.price} DH</p>
                              <p>Created the : {order.dateCreated}</p>
                              <p>Price: {order.total} DH</p>
                            </div>
                          ))
                        ) : (
                          <p>No orders available</p>
                        )}
                      </div>
                    </>
                  )}
                  </>
                )}
              </div>
            </FormContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default orders
