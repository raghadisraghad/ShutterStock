import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import PasswordValidator from '../components/PasswordValidator';
import { toast } from 'react-toastify';

const profile = () => {
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tel, setTel] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [x, setX] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [update, { isLoading }] = useUpdateUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setRole(userInfo?.user?.role);
      setFirstName(userInfo?.user?.firstName);
      setLastName(userInfo?.user?.lastName);
      setUsername(userInfo?.user?.username);
      setEmail(userInfo?.user?.email);
      setTel(userInfo?.user?.tel);
      const formattedBirthDate = userInfo?.user?.birthDate ? userInfo?.user?.birthDate.slice(0, 10) : '';
      setBirthDate(formattedBirthDate);
      setDescription(userInfo?.user?.description);
      setAvatar(userInfo?.user?.avatar);
      setMaterials(userInfo?.user?.materials);
      setInstagram(userInfo?.user?.instagram);
      setLinkedin(userInfo?.user?.linkedin);
      setFacebook(userInfo?.user?.facebook);
      setX(userInfo?.user?.x);
      setYoutube(userInfo?.user?.youtube);
      setWebsite(userInfo?.user?.website);
      setStatus(userInfo?.user?.status);
    }
  }, [userInfo]);


  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const formData = new FormData();
        formData.append('role', role);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('tel', tel);
        formData.append('birthDate', birthDate);
        formData.append('avatar', avatar);
        formData.append('description', description);
        formData.append('materials', materials);
        formData.append('instagram', instagram);
        formData.append('linkedin', linkedin);
        formData.append('facebook', facebook);
        formData.append('x', x);
        formData.append('youtube', youtube);
        formData.append('website', website);
        formData.append('status', status);

        const res = await update({ id: userInfo.user._id, ...formData }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Update Profile</h1>
      <img src={`http://localhost:3000${userInfo.user.avatar}`} alt="User Avatar" />
      <Form onSubmit={submitHandler}>

        <Form.Group className='my-2' controlId='firstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control type='text' placeholder='Enter first name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Form.Group>

        <Form.Group className='my-2' controlId='lastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control type='text' placeholder='Enter last name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Form.Group>

        <Form.Group className='my-2' controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        {/* <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <PasswordValidator password={password} setPassword={setPassword} />
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        </Form.Group> */}

        <Form.Group className='my-2' controlId='birthDate'>
          <Form.Label>Birth Date</Form.Label>
          <Form.Control type='date' value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </Form.Group>

        <Form.Group className='my-2' controlId='tel'>
          <Form.Label>Telephone</Form.Label>
          <Form.Control type='number' placeholder='Enter telephone number' value={tel} onChange={(e) => setTel(e.target.value)} />
        </Form.Group>

        <Form.Group className='my-2' controlId='avatar'>
          <Form.Label>Avatar</Form.Label>
          <Form.Control type='file' onChange={(e) => setAvatar(e.target.files[0])} />
        </Form.Group>

        {role === '2' || role === '3' ? (
          <>
            <Form.Group className='my-2' controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control as='textarea' value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group className='my-2' controlId='materials'>
              <Form.Label>Materials</Form.Label>
              <Form.Control type='text' placeholder="Enter materials, separated by commas" value={materials} onChange={(e) => setMaterials(e.target.value)} />
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

        <Button type='submit' variant='primary' className='mt-3'>
          Update
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default profile;
