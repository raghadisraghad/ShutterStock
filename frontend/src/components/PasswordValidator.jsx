import { useState } from 'react';

const PasswordValidator = ({ password, setPassword, showErrorMessage = true }) => {
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

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
        <div>
            <input type='password' placeholder='Enter password' value={password} onChange={handleChange} required />
            {showErrorMessage && !isValid && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default PasswordValidator;
