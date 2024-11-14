import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordValidator = ({ password, setPassword, showErrorMessage = true }) => {
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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

    const handleChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    return (
        <div className="password-input-container">
            <input type={isPasswordVisible ? 'text' : 'password'} placeholder='Enter password...' value={password} onChange={handleChange} className='input' required />
            {showErrorMessage && !isValid && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} className="password-toggle" >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>
    );
};

export default PasswordValidator;
