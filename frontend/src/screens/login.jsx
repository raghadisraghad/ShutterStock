import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/authApiSlice';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

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
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged In successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer className='auth'>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type={isPasswordVisible ? 'text' : 'password'} placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} ></Form.Control>
          <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary' className='mt-3' >
          Sign In
        </Button>
      </Form>

      {isLoading && <Loader />}

      <Row className='py-3'>
        <Col>
          New Customer? <Link to='/register'>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;