const router = express.Router();
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { requireAuth, alreadyLoggedIn } = require('./middleware/authMiddleware');

const validateUserInput = (username, password, email = '') => {
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!username || !password) return false;
  if (email && !isValidEmail(email)) return false;
  return true;
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
    const user = new User({ username, password, email, domainOfInterest, linkedinUrl, currentCompany, currentLevel });
    await user.save();

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const verificationToken = new VerificationToken({
      userId: user._id,
      token,
      expiresAt: Date.now() + 3600000, // 1 hour
    });
    await verificationToken.save();

    // Send verification email
    const verificationUrl = `http://${req.headers.host}/verify-email/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    };
    await transporter.sendMail(mailOptions);

    req.session.userId = user._id;
    res.redirect('/login'); // Redirecting user to login page after successful registration
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
    req.session.userId = user._id;
    res.redirect('/profile'); // Redirecting user to profile page after successful login
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
    res.redirect('/'); // Redirecting user to index page after successful logout
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