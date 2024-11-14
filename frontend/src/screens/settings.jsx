import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDeleteUserMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import { FaSun, FaMoon } from 'react-icons/fa';

const settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);  // Example for email notification
  const [notificationFrequency, setNotificationFrequency] = useState('daily');  // Frequency setting

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteUser, { isLoading: isDeletingAccount }] = useDeleteUserMutation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
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
    navigate('/terms-and-conditions');
  };

  const handleEmailNotifications = (e) => {
    setEmailNotifications(e.target.checked);
  };

  const handleNotificationFrequency = (e) => {
    setNotificationFrequency(e.target.value);
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>

      <div className="setting-section">
        <h3>Theme</h3>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
        <span>{darkMode ? <FaMoon /> : <FaSun />} {darkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>

      <div className="setting-section">
        <h3>Notifications</h3>
        <label>
          <input type="checkbox" checked={emailNotifications} onChange={handleEmailNotifications} />
          Receive Email Notifications
        </label>
        <label>
          <select value={notificationFrequency} onChange={handleNotificationFrequency}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          Notification Frequency
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
