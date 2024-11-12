import React from 'react'
import { Button } from 'react-bootstrap';
import { redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const portfolio = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate('/profile')} className="button-custom"> Back </Button>
      <h1>portfolio</h1>
    </>
  )
}

export default portfolio
