const express = require('express');
const bcrypt = require('bcryptjs'); // Added to use bcrypt for password hashing
const router = express.Router();
const User = require('../models/User');
const Employer = require('../models/Employer'); // Imported Employer model
const { requireAuth, alreadyLoggedIn } = require('./middleware/authMiddleware');

const validateUserInput = (username, password, email = '') => {
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!username || !password) return false;
  if (email && !isValidEmail(email)) return false;
  return true;
};

const validateEmployerInput = (companyName, contactEmail, password) => {
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!companyName || !password) return false;
  if (contactEmail && !isValidEmail(contactEmail)) return false;
  return true;
};

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

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
    const hashedPassword = await bcrypt.hash(password, 12); // Hashing the password
    const user = new User({ username, password: hashedPassword, email, domainOfInterest, linkedinUrl, currentCompany, currentLevel });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

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

router.post('/signup/employer', async (req, res) => {
  const { companyName, contactEmail, password } = req.body;
  if (!validateEmployerInput(companyName, contactEmail, password)) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const existingEmployer = await Employer.findOne({ $or: [{ companyName }, { contactEmail }] });
    if (existingEmployer) {
      return res.status(400).json({ message: 'Employer already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); // Hashing the employer's password
    const employer = new Employer({ companyName, contactEmail, password: hashedPassword });
    await employer.save();
    res.json({ message: 'Employer registered successfully', employerId: employer._id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering employer', error: error.message });
  }
});

router.get('/logout', requireAuth, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err });
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
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
      domainOfInterest: user.domainOfInterest,
      linkedinUrl: user.linkedinUrl,
      currentCompany: user.currentCompany,
      currentLevel: user.currentLevel
    };
    res.render('profile', { user: userInfo });
  } catch (error) {
    res.status(500).render('error', { message: 'Error retrieving user data', error: error.message });
  }
});

module.exports = router;