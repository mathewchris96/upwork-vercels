const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer'); // Changed from User model to Employer
const { requireAuth, alreadyLoggedIn } = require('./middleware/authMiddleware');

const validateEmployerInput = (username, password, contactEmail = '', companyName, industry) => { // Adjusted validation function
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!username || !password || !companyName || !industry) return false; // Added companyName and industry checks
  if (contactEmail && !isValidEmail(contactEmail)) return false; // Changed email to contactEmail
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
  if (!validateEmployerInput(username, password, email)) { // Changed from validateUserInput to validateEmployerInput
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const existingUser = await Employer.findOne({ $or: [{ username }, { contactEmail: email }] }); // Changed model to Employer and email to contactEmail
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new Employer({ username, password, contactEmail: email, domainOfInterest, linkedinUrl, currentCompany, currentLevel });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!validateEmployerInput(username, password)) { // Adjusted to use validateEmployerInput
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const user = await Employer.findOne({ username }); // Changed to Employer model
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
      contactEmail: user.contactEmail, // Adjusted from email to contactEmail
      domainOfInterest: user.domainOfInterest
    };
    req.session.userId = user._id;
    res.json({ message: 'Login successful', user: userInfo });
    
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
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
    const user = await Employer.findById(req.session.userId); // Changed to Employer model
    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }
    const userInfo = {
      userId: user._id,
      username: user.username,
      contactEmail: user.contactEmail, // Adjusted from email to contactEmail
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

// Updated route for employer signup to use the correct model and fields
router.post('/employer/signup', async (req, res) => {
  const { username, password, contactEmail, companyName, industry } = req.body; // Adjusted parameters to match Employer model
  if (!validateEmployerInput(username, password, contactEmail, companyName, industry)) { // Adjusted validation function usage
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const existingEmployer = await Employer.findOne({ $or: [{ username }, { contactEmail }] }); // Adjusted model and field to contactEmail
    if (existingEmployer) {
      return res.status(400).json({ message: 'Employer already exists' });
    }
    const employer = new Employer({ username, password, contactEmail, companyName, industry }); // Corrected instantiation to use Employer model and correct fields
    await employer.save();
    res.status(201).json({ message: 'Employer registered successfully', userId: employer._id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering employer', error: error.message });
  }
});

module.exports = router;