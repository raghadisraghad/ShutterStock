import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDeleteUserMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import { FaSun, FaMoon } from 'react-icons/fa';

const settings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteError, setDeleteError] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [deleteUser, { isLoading: isDeletingAccount }] = useDeleteUserMutation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const toggleDarkMode = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleDeleteProfile = async () => {
    const confirm = window.confirm('After deleting your account, all your data, images, and orders will be deleted permanently. Are you sure you want to delete your account?');
    if (!confirm) {
      return;
    }

    const password = prompt('Please enter your password to confirm account deletion:');
    if (!password) {
      return;
    }

    try {
      const deletePassword = { password };
      const response = await deleteUser({ id: userInfo._id, ...deletePassword }).unwrap();

      if (response) {
        dispatch(logout());
        toast.success('Profile deleted successfully!', { autoClose: 1000, });
        navigate('/');
      }
    } catch (error) {
      setDeleteError('Incorrect password or error deleting profile');
    }
  };

  const redirectToTermsAndPrivacy = () => {
    navigate('/terms-and-policy');
  };

  const handleEmailNotifications = (e) => {
    setEmailNotifications(e.target.checked);
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>

      <div className="setting-section">
        <h3>Theme</h3>
        <div className="theme-toggle-container">
          <span className="theme-icon">
            {darkMode ? <FaMoon /> : <FaSun />}
          </span>
          <div className="switch" onClick={toggleDarkMode}>
            <div className={`slider ${darkMode ? 'slider-dark' : 'slider-light'}`}></div>
          </div>
          <span>{darkMode ? 'Dark Mode' : 'Light Mode'} On</span>
        </div>
      </div>

      <div className="setting-section">
        <h3>Notifications</h3>
        <label>
          <input type="checkbox" checked={emailNotifications} onChange={handleEmailNotifications} />
          Receive Email Notifications
        </label>
      </div>

      <div className="setting-section">
        <h3>Account</h3>
        <button onClick={handleDeleteProfile}>Delete Profile</button>
        {deleteError && <p className="error">{deleteError}</p>}
      </div>

      <div className="setting-section">
        <h3>Legal</h3>
        <button onClick={redirectToTermsAndPrivacy}>Terms and Conditions & Privacy Policy</button>
      </div>
    </div>
  );
};

export default settings;
