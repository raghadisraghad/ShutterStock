import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/authApiSlice';
import { logout } from '../slices/authSlice';
import './Components.css';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar expand='lg' collapseOnSelect>
        <Container>

          <LinkContainer to={'/'}>
            <Navbar.Brand>
              <img src="../../media/logo principle green.png" alt="Brand Logo" className="logo" />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />

          <Navbar.Collapse id='basic-navbar-nav'>

            <Nav className='ms-auto'>

              <LinkContainer to={'/products'}>
                <Nav.Link>Products</Nav.Link>
              </LinkContainer>

              <LinkContainer to={'/services'}>
                <Nav.Link>Services</Nav.Link>
              </LinkContainer>

              <NavDropdown title='About' id='About'>
                <LinkContainer to={'/about'}>
                  <Nav.Link>About Us</Nav.Link>
                </LinkContainer>

                <LinkContainer to={'/how_it_works'}>
                  <Nav.Link>How It Works</Nav.Link>
                </LinkContainer>
              </NavDropdown>

              {userInfo ? (
                <LinkContainer to={'/dashboard'}>
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
              ) : (
                <></>
              )}

            </Nav>

            <Nav className='ms-auto'>
              {userInfo ? (
                <NavDropdown title={userInfo.username} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  {userInfo.role === '1' && (
                  <LinkContainer to='/orders'>
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  )}

                  {userInfo.role !== '1' && (
                    <LinkContainer to='/myProducts'>
                      <NavDropdown.Item>My Products</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  {userInfo.role === '3' && (
                    <LinkContainer to='/portfolio'>
                      <NavDropdown.Item>Portfolio</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <LinkContainer to='/setting'>
                    <NavDropdown.Item>Setting</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to={'/login'}>
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to={'/register'}>
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
