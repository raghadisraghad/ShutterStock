import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const lastActivity = Math.floor(Date.now() / 1000);// calculate the current time in seconds
    // create an expiration date by adding a 30 day time in seconds to the last activity time
    const expiration = lastActivity + (30 * 24 * 60 * 60);

    // create a json web token by adding the user's id and the secret key and expiration date of this token
    // which is 30 days from now in this case
    const token = jwt.sign({ userId: userId, lastActivity }, process.env.SECRET_KEY, { expiresIn: expiration });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;