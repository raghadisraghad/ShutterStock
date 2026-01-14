import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/authApiSlice';
import { setCredentials } from '../slices/authSlice';
import './LoginScreen.css';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/myProducts');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged In successfully!', { autoClose: 1000 });
    } catch (err) {
      toast.error(err?.data?.message || err.error, { autoClose: 1000 });
    }
  };

  return (
    <div className="login-screen">
      <div className="login-layout">
        {/* Left Section */}
        <div className="login-left">
          <h1>Welcome Back!</h1>
          <p>Access your account to manage everything in one place. Let’s make things easier for you!</p>
          <div className="image-grid">
  <img src="/images/b.png" alt="Your Logo" className="logo-image" />
</div>

        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="form-container">
            <h2 className="form-title">Log In</h2>
            <Form onSubmit={submitHandler}>
              <Form.Group className="form-group" controlId="username">
                <Form.Label>Username/Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                />
              </Form.Group>

              <Form.Group className="form-group" controlId="password">
                <Form.Label>Password</Form.Label>
                <div className="password-input-container">
                  <Form.Control
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                  <span onClick={togglePasswordVisibility} className="password-toggle">
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Button
                disabled={isLoading}
                type="submit"
                className="submit-button mt-4"
              >
                {isLoading ? 'Logging In...' : <><FaSignInAlt className="button-icon" /> Sign In</>}
              </Button>
            </Form>

            <Row className="py-3 text-center">
              <Col>
                New here? <Link to="/register" className="register-link">Create an Account</Link>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
