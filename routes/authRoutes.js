const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, alreadyLoggedIn } = require('./middleware/authMiddleware');

// Helper function for server-side validation of registration and login inputs
const validateUserInput = (username, password, email = '') => {
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!username || !password) return false;
  if (email && !isValidEmail(email)) return false;
  return true;
};
// Add a GET route for '/login' that renders the 'login.ejs' view
router.get('/index', (req, res) => {
  res.render('index');
});
router.get('/login', (req, res) => {
  res.render('login');
});

// // Add a GET route for '/register' that renders the 'register.ejs' view
router.get('/register', (req, res) => {
  res.render('register');
});
// Registration route
router.post('/register', async (req, res) => {
  const { username, password, email, domainOfInterest, linkedinUrl, currentCompany, currentLevel } = req.body;
  if (!validateUserInput(username, password, email)) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, password, email, domainOfInterest, linkedinUrl, currentCompany, currentLevel });
    await user.save();
    req.session.userId = user._id;
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!validateUserInput(username, password)) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const userInfo = {
      userId: user._id,
      username: user.username,
      email: user.email,
      domainOfInterest: user.domainOfInterest
    };
    req.session.userId = user._id;
    res.json({ message: 'Login successful', user: userInfo });
    
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Logout route
router.get('/logout', requireAuth, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err });
    }
    res.clearCookie('connect.sid'); // Assuming 'connect.sid' is the session cookie name
    res.status(200).json({ message: 'User logged out successfully' });
  });
});
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }
    const userInfo = {
      userId: user._id,
      username: user.username,
      email: user.email,
      domainOfInterest: user.domainOfInterest
    };
    res.render('profile', { user: userInfo });
  } catch (error) {
    res.status(500).render('error', { message: 'Error retrieving user data', error: error.message });
  }
});
module.exports = router;