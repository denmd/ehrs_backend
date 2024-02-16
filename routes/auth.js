const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const uuid = require('uuid');
const router = express.Router();


router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuid.v4();
    const newUser = new User({ username, password: hashedPassword, userId: userId });
    await newUser.save();
    req.session.userId = userId;
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    req.session.userId = user.userID;
    res.status(200).json({ message: 'Signin successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing in' });
  }
});

// Signout
router.post('/signout', (req, res) => {
  // Destroy the session
  req.session.destroy();
  res.status(200).json({ message: 'Signout successful' });
});

module.exports = router ;
