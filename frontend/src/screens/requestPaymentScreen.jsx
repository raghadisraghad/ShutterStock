import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './RequestPaymentScreen.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAddMutation } from '../slices/paymentApiSLice';

const RequestPaymentScreen = () => {
  const [requestPayment, { isLoading: isUploading }] = useAddMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    branch: '',
    rib: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({
      ...bankDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const data = {
        vendor : userInfo._id,
        total : userInfo.sold,
        status : "pending",
        bankDetails,
      }
      console.log(data);
      await requestPayment(data);
      toast.success('Payment Requested Successfully', { autoClose: 1000, });
      toast.success('You Will Be Updated In Less Than 7 Days');
      navigate('/dashboard');
    }catch(err){
      toast.error('An error occurred while requesting payment. Please try again.', { autoClose: 1000, });
    }
  };

  return (
    <div className="payment-container">
      <h2>Request Payment</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="accountHolderName">Nom du titulaire du compte</label>
          <input
            type="text"
            id="accountHolderName"
            name="accountHolderName"
            value={bankDetails.accountHolderName}
            onChange={handleChange}
            required
            placeholder="Nom complet"
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountNumber">Numéro de compte</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={handleChange}
            required
            placeholder="Numéro de compte bancaire"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankName">Nom de la banque</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={bankDetails.bankName}
            onChange={handleChange}
            required
            placeholder="Nom de la banque"
          />
        </div>

        <div className="form-group">
          <label htmlFor="branch">Agence de la banque</label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={bankDetails.branch}
            onChange={handleChange}
            required
            placeholder="Nom de l'agence bancaire"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rib">RIB (Relevé d'Identité Bancaire)</label>
          <input
            type="text"
            id="rib"
            name="rib"
            value={bankDetails.rib}
            onChange={handleChange}
            required
            placeholder="RIB de votre banque"
          />
        </div>

        <button type="submit" className="submit-btn">Demander un Paiement</button>
      </form>
    </div>
  );
};

export default RequestPaymentScreen;
