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
import './RegisterScreen.css'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaQuestionCircle } from 'react-icons/fa';
import { FaInstagram, FaLinkedin, FaFacebook, FaYoutube, FaGlobe } from 'react-icons/fa'; // Importing icons


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
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const showErrorMessage = true;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [emailError, setEmailError] = useState('');
  const [countryCode, setCountryCode] = useState("+212");

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

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
      return Math.min(next, 6);
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
    if (currentStep === 4 && role != '1') {
      return description && materials.length > 0;
    }
    if (currentStep === 5 && role != '1') {
      return true;
    }
    if (currentStep === 6) {
      return isChecked;
    }
    return true;
  };

  const handleChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setIsValid(false);
      setErrorMessage('Password must be at least 8 characters long.');
    } else if (!hasUpperCase || !hasLowerCase || !hasDigits || !hasSpecialChar) {
      setIsValid(false);
      setErrorMessage('Password must contain uppercase, lowercase, number, and special character.');
    } else {
      setIsValid(true);
      setErrorMessage('');
    }
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
    const minAge = 15;
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
    if (firstName && lastName) {
      const randomNum = Math.floor(Math.random() * 10000);
      const position = Math.floor(Math.random() * 3);

      let generatedUsername;

      if (position === 0) {
        generatedUsername = `${randomNum}.${lastName.toLowerCase()}`;
      } else if (position === 1) {
        const midIndex = Math.floor(lastName.length / 2);
        generatedUsername = `${lastName.toLowerCase().slice(0, midIndex)}${randomNum}${lastName.toLowerCase().slice(midIndex)}`;
      } else {
        generatedUsername = `${lastName.toLowerCase()}.${randomNum}`;
      }
      setUsername(generatedUsername);
    }
  }, [navigate, userInfo, firstName, lastName]);

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
      const userData = {
        role,
        firstName,
        lastName,
        username,
        email,
        password,
        tel,
        birthDate,
        avatar: "",
        description,
        materials,
        instagram,
        linkedin,
        facebook,
        x,
        youtube,
        website,
        status: true
      };
      console.log("userData", userData);

      await register(userData).unwrap();
      toast.success('Profile Registered Successfully', { autoClose: 2000 });
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error, "Try Again In Few Minutes...", { autoClose: 2000 });
    }
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      {currentStep === 1 && (
        <div className="role-selection-container-wrapper">
          <div className="role-selection-container">
            <div
              className="role-container"
              onClick={() => { setRole('1'); nextStep(); }}
            >
              <img src="/images/nigga1.jpg" alt="Client Role" className="role-image" />
              <h3 className="role-title">Client</h3>
              <p className="role-details">Access exclusive content and manage your downloads seamlessly.</p>
            </div>

            {/* Product Vendor Role */}
            <div
              className="role-container"
              onClick={() => { setRole('2'); nextStep(); }}
            >
              <img src="/images/nigga2.jpg" alt="Product Vendor Role" className="role-image" />
              <h3 className="role-title">Product Visionary</h3>
              <p className="role-details">Manage and sell your digital products effortlessly to a wide audience.</p>
            </div>

            {/* Service Vendor Role */}
            <div
              className="role-container"
              onClick={() => { setRole('3'); nextStep(); }}
            >
              <img src="/images/nigga3.jpg" alt="Service Vendor Role" className="role-image" />
              <h3 className="role-title">Service Expert</h3>
              <p className="role-details">Offer exceptional services and build long-term client relationships.</p>
            </div>
          </div>
        </div>
      )}


      {currentStep === 2 && (
        <div className="form-container-modern">
          <h2>Step 2: Basic Information</h2>
          <div className="form-row">
            {/* Left Section */}
            <div className="form-column">
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="form-control-modern"
                />
              </Form.Group>

              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  readOnly
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-control-modern"
                  placeholder='You can chance your username once you are logged in..'
                />
              </Form.Group>
            </div>

            {/* Right Section */}
            <div className="form-column">
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="form-control-modern"
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="form-control-modern"
                />
                {emailError && <div className="email-error">{emailError}</div>}  {/* Display email error */}
              </Form.Group>
            </div>
          </div>

          {/* Birth Date Section */}
          <Form.Group controlId="birthDate" className="birth-date-group">
  <Form.Label className="birth-date-label">Birth Date</Form.Label>
  <div className="birth-date-wrapper">
    <DatePicker
      selected={birthDate}
      onChange={handleDateChange}
      maxDate={subYears(new Date(), 15)}
      minDate={subYears(new Date(), 80)}
      showYearDropdown
      dateFormat="dd/MM/yyyy"
      className="form-control-modern date-picker-input"
    />
  </div>
</Form.Group>

        </div>
      )}


      {currentStep === 3 && (
        <div className="account-setup-container">
          <h2 className="section-title">Step 3: Account Setup</h2>

          {/* Password Field */}
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="password-input-wrapper">
              <Form.Control
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={handleChange}
                required
                className="form-control-modern password-field-modern"
              />
              <Button
                variant="link"
                onClick={togglePasswordVisibility}
                className="password-visibility-toggle"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
            {showErrorMessage && !isValid && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <div className="password-input-wrapper">
              <Form.Control
                type={isPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-control-modern password-field-modern"
              />
              <Button
                variant="link"
                onClick={togglePasswordVisibility}
                className="password-visibility-toggle"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {/* Phone Number Field with Country Code Selector */}
          <Form.Group controlId="tel">
            <Form.Label>Phone Number</Form.Label>
            <div className="phone-number-wrapper">
              <Form.Control
                as="select"
                value={countryCode}
                onChange={handleCountryChange}
                className="form-control-modern country-code-select"
              >
                <option value="+212">+212 Morocco</option>
                <option value="+1">+1 USA</option>
                <option value="+44">+44 UK</option>
                <option value="+33">+33 France</option>
                {/* Add other countries as needed */}
              </Form.Control>
              <Form.Control
                type="text"
                value={tel}
                onChange={handleTelChange}
                isInvalid={!telValidation}
                maxLength={10}
                placeholder="Enter phone number"
                className="form-control-modern phone-number-input"
              />
            </div>
            <Form.Control.Feedback type="invalid" className="phone-error-message">
              Invalid phone number
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      )}


      {currentStep === 4 && (
        <div className="profile-info-container">
          <h2 className="section-title">Step 4: Profile Information</h2>

          <div className="form-row">
            {/* Left Column for Description */}
            <div className="form-column">
              <Form.Group controlId="description">
                <Form.Label>
                  Description{" "}
                  <span className="info-tooltip" data-toggle="tooltip" title="Tell us a bit about yourself, your business, or your interests. This description helps others understand your profile better.">
                    <FaQuestionCircle />
                  </span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="form-control-modern"
                  placeholder="Describe yourself or your business in a few sentences."
                />
              </Form.Group>
            </div>

            {/* Right Column for Materials */}
            <div className="form-column">
              <Form.Group controlId="materials">
                <Form.Label>
                  Materials{" "}
                  <span className="info-tooltip" data-toggle="tooltip" title="Materials are items you use to capture pictures, videos, or audio. This could be your camera, microphone, or other tools related to your work.">
                    <FaQuestionCircle />
                  </span>
                </Form.Label>
                <div className="materials-input-wrapper">
                  <Form.Control
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="form-control-modern"
                    placeholder="Enter material name (e.g., Camera, Microphone, Tripod)"
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddMaterial}
                    className="add-material-button"
                  >
                    Add Material
                  </Button>
                </div>

                {/* Display Materials List */}
                <ul className="material-list">
                  {materials.map((material, index) => (
                    <li key={index} className="material-item">
                      {material}
                      <Button
                        variant="link"
                        onClick={() => handleRemoveMaterial(index)}
                        className="remove-material-button"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </Form.Group>
            </div>
          </div>
        </div>
      )}


      {currentStep === 5 && (
        <div className="social-links-container">
          <h2 className="section-title">Step 4: Social Media Links</h2>

          <div className="form-row">
            {/* Left Column for Social Media Inputs */}
            <div className="form-column">
              <Form.Group controlId="instagram">
                <Form.Label>Instagram</Form.Label>
                <div className="social-input-wrapper">
                  <FaInstagram className="social-icon" />
                  <Form.Control
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="      https://instagram.com/yourusername"
                    className="form-control-modern social-input"
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="linkedin">
                <Form.Label>LinkedIn</Form.Label>
                <div className="social-input-wrapper">
                  <FaLinkedin className="social-icon" />
                  <Form.Control
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="      https://linkedin.com/in/yourusername"
                    className="form-control-modern social-input"
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="facebook">
                <Form.Label>Facebook</Form.Label>
                <div className="social-input-wrapper">
                  <FaFacebook className="social-icon" />
                  <Form.Control
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="      https://facebook.com/yourusername"
                    className="form-control-modern social-input"
                  />
                </div>
              </Form.Group>
            </div>

            {/* Right Column for Social Media Inputs */}
            <div className="form-column">
              <Form.Group controlId="youtube">
                <Form.Label>YouTube</Form.Label>
                <div className="social-input-wrapper">
                  <FaYoutube className="social-icon" />
                  <Form.Control
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="      https://youtube.com/c/yourchannel"
                    className="form-control-modern social-input"
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="website">
                <Form.Label>Website</Form.Label>
                <div className="social-input-wrapper">
                  <FaGlobe className="social-icon" />
                  <Form.Control
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="      https://yourwebsite.com"
                    className="form-control-modern social-input"
                  />
                </div>
              </Form.Group>
            </div>
          </div>
        </div>


      )}

      {currentStep === 6 && (
        <div className="terms-container">
          <h2 className="section-title">Step 6: Agree to Terms</h2>
          <div className="terms-content">
            <h3 className="terms-heading">Terms and Conditions</h3>
            <div className="terms-text">
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

              <p>For more information, please read our full <a href="/terms-and-policy" target="_blank" className="terms-link">Terms and Policy</a>.</p>
            </div>

            <Form.Check
              type="checkbox"
              label="I agree to the terms and conditions"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
              className="terms-checkbox"
            />
          </div>
        </div>
      )}






      <div className="form-navigation-buttons">
        {currentStep > 1 && (
          <Button
            variant="secondary"
            onClick={prevStep}
            className="form-button-nav form-button-back"
          >
            <FaArrowLeft className="button-icon" />
          </Button>
        )}

        {/* Show Next Button starting from Step 2 onwards */}
        {currentStep > 1 && currentStep < 6 ? (
          <Button
            variant="primary"
            onClick={nextStep}
            disabled={!isStepValid()}
            className="form-button-nav form-button-next"
          >
            <FaArrowRight className="button-icon" />
          </Button>
        ) : null}

        {/* Show Submit Button on Step 7 */}
        {currentStep === 6 && (
          <Button
            variant="primary"
            type="submit"
            disabled={!isStepValid()}
            className="form-button-nav form-button-submit"
          >
            {isLoading ? <Loader /> : 'Submit'}
          </Button>
        )}
      </div>

    </Form>
  );
};

export default RegisterScreen;
