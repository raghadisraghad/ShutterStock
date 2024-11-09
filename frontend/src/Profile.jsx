import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProfileButtons from './components/ProfileButtons';

const Profile = () => {

  return (
    <>
      <h1>Profile</h1>
      <ToastContainer />
      <ProfileButtons />
      <Container className='my-2'>
        <Outlet />
      </Container>
    </>
  );
};

export default Profile;
