import { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col, Nav } from 'react-bootstrap';
import { redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { subYears } from 'date-fns';
import { useUpdateUserMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useUploadAvatarMutation } from '../slices/imageApiSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import PasswordValidator from '../components/PasswordValidator';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [x, setX] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [telValidation, setTelValidation] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [update, { isLoading }] = useUpdateUserMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  const { userInfo, token } = useSelector((state) => state.auth);
  let fileName = '';
  if (avatar instanceof File)
    fileName = avatar;
  else
    fileName = avatar.substring(avatar.lastIndexOf('\\') + 1);
  const src = `http://localhost:3000/api/pictures/avatar/${fileName}`;


  const handleAddMaterial = () => {
    if (newMaterial.trim() !== '') {
      setMaterials([...materials, newMaterial]);
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const togglePasswordVisibility2 = () => {
    setIsPasswordVisible2(!isPasswordVisible2);
  };

  const handleDateChange = (date) => {
    const today = new Date();
    const minAge = 18;
    const maxAge = 120;

    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    const isBirthdayPassedThisYear = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);

    const actualAge = isBirthdayPassedThisYear ? age : age - 1;

    if (actualAge < minAge || actualAge > maxAge) {
      setBirthDateError(`Please enter a valid birth date. Age must be between ${minAge} and ${maxAge}.`);
    } else {
      setBirthDateError('');
    }

    setBirthDate(date);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleTelChange = (e) => {
    const phoneValue = e.target.value;
    setTel(phoneValue);

    const phoneRegex = /^(0\d{9}|\+212\s?\d{4}-?\d{6})$/;

    if (phoneRegex.test(phoneValue)) {
      setTelValidation(true);
    } else {
      setTelValidation(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      setRole(userInfo?.role);
      setFirstName(userInfo?.firstName);
      setLastName(userInfo?.lastName);
      setUsername(userInfo?.username);
      setEmail(userInfo?.email);
      setTel(userInfo?.tel);
      const formattedBirthDate = userInfo?.birthDate ? userInfo?.birthDate.slice(0, 10) : '';
      setBirthDate(formattedBirthDate);
      setDescription(userInfo?.description);
      setAvatar(userInfo?.avatar);
      setMaterials(userInfo?.materials);
      setInstagram(userInfo?.instagram);
      setLinkedin(userInfo?.linkedin);
      setFacebook(userInfo?.facebook);
      setX(userInfo?.x);
      setYoutube(userInfo?.youtube);
      setWebsite(userInfo?.website);
      setStatus(userInfo?.status);
      setPassword(userInfo?.password);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (newPassword && newPassword !== confirmPassword) {
        toast.error('Passwords do not match', { autoClose: 1000, });
        return;
      }

      if (!telValidation) {
        toast.error('Phone Number Invalid', { autoClose: 1000, });
        return;
      }

      let avatarUrl = avatar;
      if (avatar instanceof File) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatar);
        avatarFormData.append('userId', userInfo._id);
        const uploadResponse = await uploadAvatar(avatarFormData).unwrap();
        avatarUrl = uploadResponse.imageUrl;
      }

      const updateData = {
        role,
        firstName,
        lastName,
        username,
        email,
        password: newPassword || password,
        tel,
        birthDate,
        avatar: avatarUrl,
        description,
        materials,
        instagram,
        linkedin,
        facebook,
        x,
        youtube,
        website,
        status,
        currentPassword,
      };

      const res = await update({ id: userInfo._id, ...updateData }).unwrap();
      const user = res?.user;

      dispatch(setCredentials({ user: user, token: token }));
      toast.success('Profile updated successfully!', { autoClose: 1000, });
      navigate('/profile');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="sidebar">
          <h5>Settings</h5>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setActiveSection('profile')} active={activeSection === 'profile'}>
              Profile
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('password')} active={activeSection === 'password'}>
              Password
            </Nav.Link>
          </Nav>
        </div>

        <div className="form-content">
          <div className="custom-form-container">
            <FormContainer>
              <div className="profileHeader">
                <label htmlFor="avatar">
                  {avatar && typeof avatar === 'string' && activeSection === 'profile' ? (
                    <img src={`${src}`} alt="User Avatar" />
                  ) : avatar instanceof File ? (
                    <img src={URL.createObjectURL(avatar)} alt="New Avatar" />
                  ) : (
                    <i className="fa fa-user-circle" style={{ fontSize: '120px', cursor: 'pointer' }}></i> // Person icon when no avatar
                  )}
                </label>

                <Form.Group className="my-2 upload-container" controlId="avatar">
                  <Form.Control type="file" id="avatar" style={{ display: 'none', cursor: 'pointer' }} onChange={handleAvatarChange} />
                </Form.Group>
                <h1>Update My {activeSection === 'profile' ? 'Profile' : 'Password'}</h1>
              </div>

              <Form onSubmit={submitHandler}>

                {activeSection === 'profile' && (
                  <>
                    <Row>
                      <Col ms={5}>
                        <Form.Group controlId="firstName" className="my-2">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </Form.Group>
                      </Col>

                      <Col ms={5}>
                        <Form.Group controlId="lastName" className="my-2">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col ms={5}>
                        <Form.Group controlId="username" className="my-2">
                          <Form.Label>Username</Form.Label>
                          <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                      </Col>

                      <Col ms={5}>
                        <Form.Group controlId="email" className="my-2">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col ms={5}>
                        <Form.Group controlId="tel">
                          <Form.Label>Telephone</Form.Label>
                          <Form.Control type="text" value={tel} onChange={handleTelChange} placeholder="Enter your phone number" />
                          {!telValidation && (
                            <div className="error">
                              Please enter a valid Moroccan phone number.
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col ms={5}>
                        <Form.Group controlId='birthDate' className="inputBirthDay" >
                          <Form.Label>Birth Date</Form.Label>
                          <DatePicker selected={birthDate} onChange={handleDateChange} maxDate={subYears(new Date(), 13)} minDate={subYears(new Date(), 80)} placeholderText="Select birth date" showYearDropdown dateFormat="dd/MM/yyyy" />
                          {birthDateError && <div>{birthDateError}</div>}
                        </Form.Group>
                      </Col>
                    </Row>

                    {role === '2' || role === '3' && (
                      <>
                        <Form.Group className="my-2" controlId='description'>
                          <Form.Label>Description</Form.Label>
                          <Form.Control as='textarea' placeholder='Enter a description about yourself...' value={description}
                            onChange={(e) => { if (e.target.value.length <= 300) { setDescription(e.target.value); } }} maxLength={300} />
                          <div className="text-end mt-2"> <small>{description.length} / 300 characters</small> </div>
                        </Form.Group>

                        <Row>
                          <Col ms={5}>
                            <Form.Group controlId='materials'>
                              <Form.Label>Materials</Form.Label>
                              <div className="d-flex">
                                <Form.Control type='text' placeholder="Enter a material" value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} />
                                <Button variant="outline-primary" onClick={handleAddMaterial} className="ms-2">Add</Button>
                              </div>
                              <div className="materials">
                                <ul>
                                  {materials.map((material, index) => (
                                    <li key={index}>
                                      {material} <span onClick={() => handleRemoveMaterial(index)}>X</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col ms={5}>
                            <Form.Group className='my-2' controlId='instagram'>
                              <Form.Label>Instagram</Form.Label>
                              <Form.Control type='text' value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col ms={5}>
                            <Form.Group className='my-2' controlId='linkedin'>
                              <Form.Label>Linkedin</Form.Label>
                              <Form.Control type='text' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                            </Form.Group>
                          </Col>

                          <Col ms={5}>
                            <Form.Group className='my-2' controlId='facebook'>
                              <Form.Label>Facebook</Form.Label>
                              <Form.Control type='text' value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col ms={5}>
                            <Form.Group className='my-2' controlId='x'>
                              <Form.Label>X</Form.Label>
                              <Form.Control type='text' value={x} onChange={(e) => setX(e.target.value)} />
                            </Form.Group>
                          </Col>

                          <Col ms={5}>
                            <Form.Group className='my-2' controlId='youtube'>
                              <Form.Label>Youtube</Form.Label>
                              <Form.Control type='text' value={youtube} onChange={(e) => setYoutube(e.target.value)} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Col ms={5}>
                          <Form.Group className='my-2' controlId='website'>
                            <Form.Label>Website</Form.Label>
                            <Form.Control type='text' value={website} onChange={(e) => setWebsite(e.target.value)} />
                          </Form.Group>
                        </Col>
                      </>
                    )}

                  </>
                )}

                {activeSection === 'password' && (
                  <>
                    <Form.Group controlId="currentPassword" className="my-2">
                      <div className="password-input-container">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control placeholder='Current Password...' type={isPasswordVisible ? 'text' : 'password'} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <span onClick={togglePasswordVisibility} className="password-toggle">
                          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </Form.Group>

                    
                    <PasswordValidator password={newPassword} setPassword={setNewPassword} />

                    <Form.Group controlId="confirmPassword" className="my-2">
                      <div className="password-input-container">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type={isPasswordVisible2 ? 'text' : 'password'} placeholder="Confirm new password..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <span onClick={togglePasswordVisibility2} className="password-toggle">
                          {isPasswordVisible2 ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </Form.Group>
                  </>
                )}

                <div className='center'>
                  <Button type="submit" variant="primary" className="mt-3">
                    Update
                  </Button>
                </div>

                {(isLoading || isUploading) && <Loader />}

              </Form>
            </FormContainer>
          </div>
        </div>

      </div>
    </>
  );
};

export default Profile;
