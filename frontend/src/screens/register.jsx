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
  const [currentStep, setCurrentStep] = useState(1);
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
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const nextStep = () => {
    if (!isStepValid()) {
      toast.error('Please complete the required fields.');
      return;
    }
    setCurrentStep((prev) => {
      let next = prev + 1;
      if (role === '1' && (next === 4 || next === 5)) {
        next = 6;
      }
      return Math.min(next, 7);
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      let previous = prev - 1;
  
      if (role === '1' && (previous === 5 || previous === 4)) {
        previous = 3;
      }
  
      return Math.max(previous, 1);
    });
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return true;
    }
    if (currentStep === 2) {
      return firstName && lastName && username && email && birthDate && !birthDateError;
    }
    if (currentStep === 3) {
      return password && confirmPassword && password === confirmPassword && tel && telValidation;
    }
    if (currentStep === 4 && role!='1') {
      return description && materials.length > 0;
    }
    if (currentStep === 5 && role!='1') {
      return true;
    }
    if (currentStep === 6 && role!='1') {
      return true;
    }
    if (currentStep === 7) {
      return isChecked;
    }
    return true;
  };

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
        toast.error("File's Size Should Be Less Than 20MB.", { autoClose: 2000 });
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Please Upload A Valid Image (JPEG/PNG/JPG).", { autoClose: 2000 });
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

    if (!isChecked) {
      toast.error('You Should Accept Our Terms&Policy..', { autoClose: 2000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords Do Not Match!', { autoClose: 2000 });
      return;
    }

    if (!telValidation) {
      toast.error('Phone Number Invalid!', { autoClose: 2000 });
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
      };

      await register(userData).unwrap();
      toast.success('Profile Registered Successfully', { autoClose: 2000 });
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error, "Try Again In Few Minutes...", { autoClose: 2000 });
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      {currentStep === 1 && (
        <div>
          <h2>Step 1: Account Type</h2>
          <Form.Group controlId='role'>
            <Form.Label>Select Role</Form.Label>
            <Form.Control as='select' value={role} onChange={(e) => setRole(e.target.value)}>
              <option value='1'>Client</option>
              <option value='2'>Vendor Product</option>
              <option value='3'>Vendor Service</option>
            </Form.Control>
          </Form.Group>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Step 1: Basic Information</h2>
          <Form.Group controlId='firstName'>
            <Form.Label>First Name</Form.Label>
            <Form.Control type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId='lastName'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId='birthDate'>
            <Form.Label>Birth Date</Form.Label>
            <DatePicker
              selected={birthDate}
              onChange={handleDateChange}
              maxDate={subYears(new Date(), 13)}
              minDate={subYears(new Date(), 80)}
              showYearDropdown
              dateFormat='dd/MM/yyyy'
            />
          </Form.Group>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2>Step 2: Account Setup</h2>
          <Form.Group controlId='password'>
            <PasswordValidator password={password} setPassword={setPassword} required />
          </Form.Group>
          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={isPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button variant="link" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </Form.Group>
          <Form.Group controlId='tel'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              value={tel}
              onChange={handleTelChange}
              isInvalid={!telValidation}
              maxLength={10}
              required
            />
            <Form.Control.Feedback type="invalid">Invalid phone number</Form.Control.Feedback>
          </Form.Group>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <h2>Step 3: Profile Information</h2>
          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId='materials'>
            <Form.Label>Materials</Form.Label>
            <div>
              <Form.Control
                type='text'
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
              />
              <Button variant="primary" onClick={handleAddMaterial}>Add Material</Button>
            </div>
            <ul>
              {materials.map((material, index) => (
                <li key={index}>
                  {material} <Button variant="link" onClick={() => handleRemoveMaterial(index)}>Remove</Button>
                </li>
              ))}
            </ul>
          </Form.Group>
        </div>
      )}

      {currentStep === 5 && (
        <div>
          <h2>Step 4: Social Media Links</h2>
          <Form.Group controlId='instagram'>
            <Form.Label>Instagram</Form.Label>
            <Form.Control type='text' value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </Form.Group>
          <Form.Group controlId='linkedin'>
            <Form.Label>LinkedIn</Form.Label>
            <Form.Control type='text' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          </Form.Group>
          <Form.Group controlId='facebook'>
            <Form.Label>Facebook</Form.Label>
            <Form.Control type='text' value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          </Form.Group>
          <Form.Group controlId='youtube'>
            <Form.Label>YouTube</Form.Label>
            <Form.Control type='text' value={youtube} onChange={(e) => setYoutube(e.target.value)} />
          </Form.Group>
          <Form.Group controlId='website'>
            <Form.Label>Website</Form.Label>
            <Form.Control type='text' value={website} onChange={(e) => setWebsite(e.target.value)} />
          </Form.Group>
        </div>
      )}

      {currentStep === 6 && (
        <div>
          <h2>Step 6: Identification</h2>
          <Form.Group controlId='avatar'>
            <Form.Label>Picture</Form.Label>
            <Form.Control type='file' onChange={handleAvatarChange} className="upload-btn" required />
            {avatarUrl && <img src={avatarUrl} alt="Avatar preview" width="100" />}
          </Form.Group>
        </div>
      )}

      {currentStep === 7 && (
        <div>
          <h2>Step 7: Agree to Terms</h2>
          <Form.Group controlId="termsCheckbox">

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

            <Form.Check
              type="checkbox"
              label="I agree to the terms and conditions"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
            />
          </Form.Group>
        </div>
      )}

      <div className="d-flex justify-content-between">
        {currentStep > 1 && <Button variant="secondary" onClick={prevStep}>Back</Button>}
        {currentStep < 7 && <Button variant="primary" onClick={nextStep} disabled={!isStepValid()}>Next</Button>}
        {currentStep === 7 && <Button variant="primary" type="submit" disabled={!isStepValid()}>{isLoading ? <Loader /> : 'Submit'}</Button>}
      </div>
    </Form>
  );
};

export default RegisterScreen;
