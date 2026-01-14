import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/authApiSlice';
import { logout } from '../slices/authSlice';
import { useGetOrdersByClientQuery } from '../slices/ordersApiSlice';
import './header.css';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // To track the current route
  const [logoutApiCall] = useLogoutMutation();
  const { data: cart, isLoading: cartLoading, error: cartError, refetch: cartCart } = useGetOrdersByClientQuery(userInfo?._id);

  const [isScrolled, setIsScrolled] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const pendingOrders = cart?.filter(order => order.status === 'pending') || [];

  // Handle scroll event
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <Container>

          <LinkContainer to="/">
            <Navbar.Brand>
              <img src="/logo principle green.png" alt="Brand Logo" className="logo" />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="ms-auto">
              <LinkContainer to="/images" className={location.pathname === '/images' ? 'active' : ''}>
                <Nav.Link>Images</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/videos" className={location.pathname === '/videos' ? 'active' : ''}>
                <Nav.Link>Videos</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/audios" className={location.pathname === '/audios' ? 'active' : ''}>
                <Nav.Link>Audios</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/services" className={location.pathname === '/services' ? 'active' : ''}>
                <Nav.Link>Services</Nav.Link>
              </LinkContainer>

              {userInfo && userInfo.role && ['2', '3','0'].includes(userInfo.role) && (
                <LinkContainer to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
              )}
            </Nav>

            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  {userInfo.role === "1" && (
                    <NavDropdown
                      title={
                        <>
                          <FaShoppingCart />
                          {pendingOrders.length > 0 && (
                            <span className="cart-badge">{pendingOrders.length}</span>
                          )}
                        </>
                      }
                      id="cart"
                      align="end"
                      className="cart-dropdown"
                    >
                      {pendingOrders.length > 0 ? (
                        pendingOrders.map((order) => (
                          <LinkContainer key={order._id} to="/cart">
                            <NavDropdown.Item className="cart-item-container">
                              <div className="cart-item">
                                {order.video.length > 0 || order.product.length > 0 || order.audio.length > 0 ? (
                                  <div className="cart-item-icon">
                                    {order.video.length > 0 ? (
                                      <i className="fas fa-video"></i>
                                    ) : order.product.length > 0 ? (
                                      <i className="fas fa-image"></i>
                                    ) : order.audio.length > 0 ? (
                                      <i className="fas fa-music"></i>
                                    ) : null}
                                  </div>
                                ) : (
                                  <div className="no-media">No media available</div>
                                )}
                                <div className="cart-item-details">
                                  <span className="cart-item-title">
                                    {order.video.length > 0
                                      ? order.video[0]?.title
                                      : order.product.length > 0
                                        ? order.product[0]?.title
                                        : order.audio.length > 0
                                          ? order.audio[0]?.title
                                          : "No title"}
                                  </span>
                                  <span className="cart-item-price">
                                    {order.total.toFixed(2)} DH
                                  </span>
                                </div>
                              </div>
                            </NavDropdown.Item>
                          </LinkContainer>

                        ))
                      ) : (
                        <NavDropdown.Item>No Pending Orders</NavDropdown.Item>
                      )}
                    </NavDropdown>
                  )}

                  <NavDropdown title={<><span>{userInfo.username}</span><i className="fas fa-chevron-down"></i></>} id="username" className="user-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    {userInfo.role === "1" && (
                      <>
                        <LinkContainer to="/orders">
                          <NavDropdown.Item>My Orders</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/cart">
                          <NavDropdown.Item>Cart</NavDropdown.Item>
                        </LinkContainer>
                      </>
                    )}

                    {userInfo.role === "2" && (
                      <>
                        <LinkContainer to="/myProducts">
                          <NavDropdown.Item>My Images</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/myVideos">
                          <NavDropdown.Item>My Videos</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/myAudios">
                          <NavDropdown.Item>My Audios</NavDropdown.Item>
                        </LinkContainer>
                      </>
                    )}

                    {userInfo.role === "3" && (
                      <LinkContainer to="/portfolio">
                        <NavDropdown.Item>My Service</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    <LinkContainer to="/setting">
                      <NavDropdown.Item>Setting</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>

                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
