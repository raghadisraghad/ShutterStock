import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const register = asyncHandler(async (req, res) => {
  const {
    role, firstName, lastName, username, email,
    password, tel, birthDate, avatar, description,
    materials, instagram, linkedin, facebook,
    x, youtube, website, status
  } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ message: "User Already Exists !" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    role,
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    tel,
    birthDate,
    avatar,
    description,
    materials,
    instagram,
    linkedin,
    facebook,
    x,
    youtube,
    website,
    status
  });
  await newUser.save();

  res.status(201).json({ message: "User Created Successfully" });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Incorrect UserName" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (user.status) {
    if (isPasswordValid) {
      const token = generateToken(res, user._id);
      res.status(200).json({ message: 'Logged In successfully', user, token });
    } else {
      return res.status(400).json({ message: "Incorrect Password!" });
    }
  } else {
    return res.status(400).json({ message: "Account Not Activated Yet!" });
  }

});

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export {
  register,
  login,
  logoutUser
};