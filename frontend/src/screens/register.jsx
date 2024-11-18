import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRegisterMutation } from '../slices/authApiSlice';
import { useUploadAvatarMutation } from '../slices/imageApiSlice';
import { subYears } from 'date-fns';
import Loader from '../components/Loader';
import PasswordValidator from '../components/PasswordValidator';

const RegisterScreen = () => {
  const [role, setRole] = useState('1');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tel, setTel] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [birthDateError, setBirthDateError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [x, setX] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');
  const [telValidation, setTelValidation] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
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

  const handleDateChange = (date) => {
    const today = new Date();
    const minAge = 13;
    const maxAge = 80;

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
      if (file.size > 20000000) {
        toast.error("File's Size Should Be Less Than 20MB.", { autoClose: 2000, });
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Please Upload A Valid Image (JPEG/PNG/JPG).", { autoClose: 2000, });
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
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
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const status = role !== '1' ? false : true;
    if (!isChecked) {
      toast.error('You Should Accept Our Terms&Policy..', { autoClose: 2000, });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords Do Not Match!', { autoClose: 2000, });
      return;
    }

    if (!telValidation) {
      toast.error('Phone Number Invalid!', { autoClose: 2000, });
      return;
    }

    try {
      let avatarImageUrl = '';
      if (avatar) {
        const avatarData = new FormData();
        avatarData.append('avatar', avatar);
        const avatarResponse = await uploadAvatar(avatarData).unwrap();
        avatarImageUrl = avatarResponse.imageUrl;
      }

      const userData = {
        role,
        firstName,
        lastName,
        username,
        email,
        password,
        tel,
        birthDate,
        avatar: avatarImageUrl,
        description,
        materials,
        instagram,
        linkedin,
        facebook,
        x,
        youtube,
        website,
        status
      };

      await register(userData).unwrap();
      toast.success('Profile Registered Successfully', { autoClose: 2000, });
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error, "Try Again In Few Minutes...", { autoClose: 2000, });
    }
  };

  return (
    <>
      <div className='registerRole'>
        {[
          { value: '1', label: 'Client' },
          { value: '2', label: 'Vendor Product' },
          { value: '3', label: 'Vendor Service' },
        ].map((item) => (
          <div key={item.value} className='div'
            style={{
              padding: '10px',
              border: `2px solid ${role === item.value ? 'blue' : 'gray'}`,
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: role === item.value ? '#f0f8ff' : '#fff',
            }} onClick={() => setRole(item.value)} >
            {item.label}
          </div>
        ))}
      </div>

      <div className='register'>
        <div className='profileHeader'>
          <h1>Register</h1>
        </div>

        <Form onSubmit={submitHandler}>
          <div className='row g-3'>

            <Col sm={4}>
              <Form.Group controlId='firstName'>
                <Form.Label>First Name</Form.Label>
                <Form.Control type='text' placeholder='Enter first name' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId='lastName'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type='text' placeholder='Enter last name' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control type='text' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} required />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId='birthDate'>
                <Form.Label>Birth Date</Form.Label><br />
                <DatePicker className='input' selected={birthDate} onChange={handleDateChange} maxDate={subYears(new Date(), 13)} minDate={subYears(new Date(), 80)} placeholderText="Select birth date" showYearDropdown dateFormat="dd/MM/yyyy" />
                {birthDateError && <div>{birthDateError}</div>}
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <PasswordValidator password={password} setPassword={setPassword} required />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <div className="password-input-container">
                  <Form.Control type={isPasswordVisible ? 'text' : 'password'} placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  <span onClick={togglePasswordVisibility} className="password-toggle">
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId="tel">
                <Form.Label>Telephone</Form.Label>
                <Form.Control type="text" value={tel} onChange={handleTelChange} placeholder="Enter your phone number" required />
                {!telValidation && (
                  <div className="error">
                    Please enter a valid Moroccan phone number.
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId='avatar'>
                <Form.Label>Avatar</Form.Label>
                <Form.Control type='file' onChange={handleAvatarChange} className="upload-btn" required />
                {avatarUrl && <img src={avatarUrl} alt="Avatar preview" width="100" />}
              </Form.Group>
            </Col>

            {(role === '2' || role === '3') && (
              <>
                <Col sm={4}>
                  <Form.Group controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as='textarea' placeholder='Enter a description about yourself...' value={description}
                      onChange={(e) => { if (e.target.value.length <= 300) { setDescription(e.target.value); } }} maxLength={300} required />
                    <div className="text-end mt-2"> <small>{description.length} / 300 characters</small> </div>
                  </Form.Group>
                </Col>

                <Col sm={4}>
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

                <Col sm={4}>
                  <Form.Group controlId='instagram'>
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control type='text' placeholder='Enter your instagram url' value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col sm={4}>
                  <Form.Group controlId='linkedin'>
                    <Form.Label>Linkedin</Form.Label>
                    <Form.Control type='text' placeholder='Enter your Linkedin url' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col sm={4}>
                  <Form.Group controlId='facebook'>
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control type='text' placeholder='Enter your facebook url' value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col sm={4}>
                  <Form.Group controlId='x'>
                    <Form.Label>X</Form.Label>
                    <Form.Control type='text' placeholder='Enter your twitter url' value={x} onChange={(e) => setX(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col sm={4}>
                  <Form.Group controlId='youtube'>
                    <Form.Label>Youtube</Form.Label>
                    <Form.Control type='text' placeholder='Enter your youtube url' value={youtube} onChange={(e) => setYoutube(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col sm={4}>
                  <Form.Group controlId='website'>
                    <Form.Label>Website</Form.Label>
                    <Form.Control type='text' placeholder='Enter your personal website url' value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </Form.Group>
                </Col>
              </>
            )}
            <div className='container-policy'>
              {showTerms && (
                <div className='term-policy-container'>
                  <button style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    padding: '5px 10px',
                  }} onClick={() => setShowTerms(false)} >
                    X
                  </button>
                  <h3>Terms and Conditions</h3>
                  <div>
                    <p><strong>1. Introduction</strong></p>
                    <p>By using this service, you agree to our Terms and Conditions. Please read them carefully.</p>

                    <p><strong>2. Use of Service</strong></p>
                    <p>You agree to use the service responsibly, following the guidelines and not engaging in harmful activities.</p>

                    <p><strong>3. Account Registration</strong></p>
                    <p>To access certain features, you must create an account and provide accurate information. You are responsible for maintaining the security of your account.</p>

                    <p><strong>4. Licensing and Content Use</strong></p>
                    <p>The content you license through our platform is governed by specific usage rights and restrictions. You must not redistribute or misuse the content.</p>

                    <p><strong>5. Privacy Policy</strong></p>
                    <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your data. Please review it for more details.</p>

                    <p><strong>6. Prohibited Uses</strong></p>
                    <p>You may not use the platform for illegal or harmful activities, and must respect the rights of others while using the content.</p>

                    <p>For more information, please read our full <a href="/terms-and-policy" target="_blank">Terms and Policy</a>.</p>
                  </div>
                </div>

              )}
              <div>
                <label>
                  <input className='checkbox' type="checkbox" name="terms" checked={isChecked} onChange={handleCheckboxChange} required />
                  I have read and accepted the <a href="#"  onClick={(e) => { e.preventDefault(); setShowTerms(true); }} target="_blank">Terms and Policy</a>.
                </label>
              </div>
            </div>

            <Col sm={12} className='center'>
              <Button type='submit' variant='primary' disabled={isLoading || isUploading} className='mt-3'>
                {isLoading || isUploading ? <Loader /> : 'Register'}
              </Button>
            </Col>
          </div>
        </Form>

        <div className='py-3'>
          <Col>
            Have an account? <Link to='/login'>Login</Link>
          </Col>
        </div>
      </div>
    </>
  );
};

export default RegisterScreen;