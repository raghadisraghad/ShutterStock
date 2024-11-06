import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const register = asyncHandler(async (req, res) => {
  const { role,firstName,lastName,username,email,password,tel,birthDate,avatar,
    description,materials,instagram,linkedin,facebook,x,youtube,website } = req.body;// get the json

  // check if a user with the given username or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ message: "User Already Exists !" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);// if user didn't exist hash the password

  // save the new user with the given data and with a hashed password
  const newUser = new User({ role,firstName,lastName,username,email,password: hashedPassword,tel,birthDate,avatar,
    description,materials,instagram,linkedin,facebook,x,youtube,website });
  await newUser.save();

  res.status(201).json({ message: "User Created Successfully" });// send verification message
});

const login = asyncHandler(asyncHandler(async (req, res) => {
  const { username, password } = req.body;// get the username and password from the json

  const user = await User.findOne({ username });
  if(!user){
    return res.status(400).json({ message: "Incorrect UserName" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    generateToken(res, user._id);
    // const lastActivity = Math.floor(Date.now() / 1000);
    // const expiration = lastActivity + (30 * 24 * 60 * 60);
    // const token = jwt.sign({ userId: user._id, lastActivity }, process.env.SECRET_KEY, { expiresIn: expiration });
    res.status(200).json({});
  }else{
    return res.status(400).json({ message: "Incorrect Password!" });
  }
}));

export {
  register,
  login
};