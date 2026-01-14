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
import './Profile.css';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('');
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
  const [update, { isLoading }] = useUpdateUserMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  const { userInfo, token } = useSelector((state) => state.auth);

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
      setActiveSection('profile');
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
        const formData = new FormData();
        formData.append('avatar', avatar);
        const uploadResponse = await uploadAvatar({id:userInfo._id, formData}).unwrap();
        avatarUrl = uploadResponse.imageUrl;
      }
      console.log("avatarUrl",avatarUrl);

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
      console.log("updateData",updateData);

      const res = await update({ id: userInfo._id, ...updateData }).unwrap();
      const user = res?.user;

      dispatch(setCredentials({ user: user, token: token }));
      toast.success('Profile updated successfully!', { autoClose: 1000, });
      window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred', { autoClose: 1000, });
    }
  };

  return (
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
        {/* Profile Header */}
        <div className="profile-header">
          <label htmlFor="avatar" className="avatar-upload-label">
            {avatar && (typeof avatar === 'string' ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}api/pictures/avatar/${userInfo._id}/${avatar.split('/').pop()}`}
                alt="User Avatar"
              />
            ) : avatar instanceof File ? (
              <img src={URL.createObjectURL(avatar)} alt="New Avatar" />
            ) : (
              <i className="fa fa-user-circle">Click to upload</i>
            ))}
          </label>

          <Form.Group controlId="avatar" className="my-2 upload-container">
            <Form.Control type="file" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </Form.Group>
          <h1>Update My {activeSection === 'profile' ? 'Profile' : 'Password'}</h1>
        </div>

        {/* Form Section */}
        <Form onSubmit={submitHandler}>
          {activeSection === 'profile' && (
            <>
              {/* Profile form inputs */}
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="firstName" className="my-2">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group controlId="lastName" className="my-2">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Other inputs */}
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="username" className="my-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group controlId="email" className="my-2">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Date of Birth and Phone */}
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="tel" className="my-2">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control
                      type="text"
                      value={tel}
                      maxLength={10}
                      onChange={(e) => setTel(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group controlId="birthDate" className="my-2">
                    <Form.Label>Birth Date  . .</Form.Label>
                    <DatePicker
                      selected={birthDate}
                      onChange={(date) => setBirthDate(date)}
                      maxDate={subYears(new Date(), 13)}
                      minDate={subYears(new Date(), 80)}
                      placeholderText="Select birth date"
                      showYearDropdown
                      dateFormat="dd/MM/yyyy"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Description */}
              <Form.Group className="my-2" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter a description about yourself..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                />
                <div className="text-end mt-2">
                  <small>{description.length} / 300 characters</small>
                </div>
              </Form.Group>

              {/* Social links */}
              <Form.Group controlId="socialLinks">
                <Form.Label>Social Links</Form.Label>
                <div className="social-links">
                  <div className="social-input">
                    <Form.Control
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram"
                    />
                    <i className="fab fa-instagram social-icon"></i>
                  </div>
                  <div className="social-input">
                    <Form.Control
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn"
                    />
                    <i className="fab fa-linkedin social-icon"></i>
                  </div>
                  <div className="social-input">
                    <Form.Control
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook"
                    />
                    <i className="fab fa-facebook social-icon"></i>
                  </div>
                  <div className="social-input">
                    <Form.Control
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="YouTube"
                    />
                    <i className="fab fa-youtube social-icon"></i>
                  </div>
                  <div className="social-input">
                    <Form.Control
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Website"
                    />
                    <i className="fas fa-globe social-icon"></i>
                  </div>
                </div>
              </Form.Group>
            </>
          )}

          {/* Password Section */}
          {activeSection === 'password' && (
            <>
              <Form.Group controlId="currentPassword" className="my-2">
                <div className="password-input-container">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Current Password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <span onClick={togglePasswordVisibility} className="password-toggle">
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Form.Group controlId="newPassword" className="my-2">
                <div className="password-input-container">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type={isPasswordVisible2 ? 'text' : 'password'}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span onClick={togglePasswordVisibility2} className="password-toggle">
                    {isPasswordVisible2 ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="my-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type={isPasswordVisible2 ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </>
          )}

          <div className="center">
            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};


export default Profile;
