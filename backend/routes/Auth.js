const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

router.post('/register', async (req, res) => {
  const { role,firstName,lastName,username,email,password,tel,birthDate,avatar,
    description,materials,instagram,linkedin,facebook,x,youtube,website } = req.body;// get the json

  try {
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
  } catch (error) {
    res.status(500).json({ message: "Error while creating the user !!!" });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;// get the username and password from the json

  try {
    // check if user doesn't exist send a message
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Incorrect UserName!" });
    }

    // check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect Password!" });
    }
    
    const lastActivity = Math.floor(Date.now() / 1000);// calculate the current time in seconds
    // create an expiration date by adding a 30 day time in seconds to the last activity time
    const expiration = lastActivity + (30 * 24 * 60 * 60);

    // create a json web token by adding the user's id and the secret key and expiration date of this token
    // which is 30 days from now in this case
    const token = jwt.sign({ userId: user._id, lastActivity }, process.env.SECRET_KEY, { expiresIn: expiration });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error While Connecting The User !!!" });
  }
});

module.exports = router;