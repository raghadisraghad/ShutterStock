import React from 'react'
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const contact = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate('/profile')} className="button-custom"> Back </Button>

      <h1>contact</h1>
    </>
  )
}

export default contact
