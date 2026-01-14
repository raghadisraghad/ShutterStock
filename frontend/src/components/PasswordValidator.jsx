import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Form } from 'react-bootstrap';

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
        <Form.Group controlId="password">
            <div className="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control type={isPasswordVisible ? 'text' : 'password'} placeholder="Enter New Password..." value={password} onChange={handleChange} />
                <span onClick={togglePasswordVisibility} className="password-toggle">
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
            {showErrorMessage && !isValid && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Form.Group>
    );
};

export default PasswordValidator;
