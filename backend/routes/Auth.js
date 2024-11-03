const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription de l'utilisateur" });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Nom d'utilisateur incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
    
    const lastActivity = Math.floor(Date.now() / 1000);
    const expiration = lastActivity + (7 * 24 * 60 * 60);

    const token = jwt.sign({ userId: user._id, lastActivity }, 'votre_secret', { expiresIn: expiration });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur" });
  }
});

module.exports = router;