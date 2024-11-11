import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileButtons = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const role = userInfo?.role;

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div className="profile-buttons-container">

      <Button onClick={() => handleRedirect('/update')} className="button-custom">
        Update Profile
      </Button>

      <Button onClick={() => handleRedirect('/orders')} className="button-custom">
        Orders
      </Button>

      {role === '2' || role === '3' ? (
        <>
          <Button onClick={() => handleRedirect('/collections')} className="button-custom">
            Collections
          </Button>

          <Button onClick={() => handleRedirect('/contact')} className="button-custom">
            Contact
          </Button>
        </>
      ) : null}

      {role === '3' && (
        <Button onClick={() => handleRedirect('/portfolio')} className="button-custom">
          Portfolio
        </Button>
      )}
    </div>
  );
};

export default ProfileButtons;
