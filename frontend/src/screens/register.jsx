import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/authApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [role, setRole] = useState('1');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tel, setTel] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [x, setX] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const status = role === '3' ? true : false;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({
          role,
          firstName,
          lastName,
          username,
          email,
          password,
          tel,
          birthDate,
          avatar,
          description,
          materials: materials.split(', '),  // Store as an array
          instagram,
          linkedin,
          facebook,
          x,
          youtube,
          website,
          status,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='role'>
          <Form.Label>Role</Form.Label>
          <Form.Control as='select' value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value='1'>Client</option>
            <option value='2'>Vendor Product</option>
            <option value='3'>Vendor Service</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='firstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control type='text' placeholder='Enter first name' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='lastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control type='text' placeholder='Enter last name' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='birthDate'>
          <Form.Label>Birth Date</Form.Label>
          <Form.Control type='date' value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='tel'>
          <Form.Label>Telephone</Form.Label>
          <Form.Control type='text' placeholder='Enter telephone number' value={tel} onChange={(e) => setTel(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='avatar'>
          <Form.Label>Avatar</Form.Label>
          <Form.Control type='file' onChange={(e) => setAvatar(e.target.files[0])} required />
        </Form.Group>

        {role === '2' || role === '3' ? (
          <>
            <Form.Group className='my-2' controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control as='textarea' value={description} onChange={(e) => setDescription(e.target.value)} required />
            </Form.Group>

            <Form.Group className='my-2' controlId='materials'>
              <Form.Label>Materials</Form.Label>
              <Form.Control type='text' placeholder="Enter materials, separated by commas" value={materials} onChange={(e) => setMaterials(e.target.value)} required />
            </Form.Group>

            <Form.Group className='my-2' controlId='instagram'>
              <Form.Label>Instagram</Form.Label>
              <Form.Control type='text' value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </Form.Group>

            <Form.Group className='my-2' controlId='linkedin'>
              <Form.Label>Linkedin</Form.Label>
              <Form.Control type='text' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </Form.Group>

            <Form.Group className='my-2' controlId='facebook'>
              <Form.Label>Facebook</Form.Label>
              <Form.Control type='text' value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            </Form.Group>

            <Form.Group className='my-2' controlId='x'>
              <Form.Label>X</Form.Label>
              <Form.Control type='text' value={x} onChange={(e) => setX(e.target.value)} />
            </Form.Group>

            <Form.Group className='my-2' controlId='youtube'>
              <Form.Label>Youtube</Form.Label>
              <Form.Control type='text' value={youtube} onChange={(e) => setYoutube(e.target.value)} />
            </Form.Group>

            <Form.Group className='my-2' controlId='website'>
              <Form.Label>Website</Form.Label>
              <Form.Control type='text' value={website} onChange={(e) => setWebsite(e.target.value)} />
            </Form.Group>
          </>
        ) : null}

        {role === '3' && (
          <Form.Group className='my-2' controlId='whatsapp'>
            <Form.Label>Contact us on WhatsApp</Form.Label>
            <a href="https://wa.me/your-whatsapp-number" target="_blank" rel="noopener noreferrer">
              Click here to communicate more about creating your account
            </a>
          </Form.Group>
        )}

        <Button type='submit' variant='primary' className='mt-3'>
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
