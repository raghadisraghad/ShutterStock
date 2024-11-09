import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProfileButtons = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };
  return (
    <div>
      <Button variant="primary" onClick={() => handleRedirect('/profile/update')} className="m-2">
        Update Profile
      </Button>
      <Button variant="secondary" onClick={() => handleRedirect('/profile/orders')} className="m-2">
        Orders
      </Button>
      <Button variant="success" onClick={() => handleRedirect('/profile/collections')} className="m-2">
        Collections
      </Button>
      <Button variant="danger" onClick={() => handleRedirect('/profile/contact')} className="m-2">
        Contact
      </Button>
      <Button variant="danger" onClick={() => handleRedirect('/profile/portfolio')} className="m-2">
        Portfolio
      </Button>
    </div>
  )
}

export default ProfileButtons
