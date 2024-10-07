const router = express.Router();
const VerificationToken = require('../models/VerificationToken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Route to verify user's email
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Find the verification token in the database
    const verificationToken = await VerificationToken.findOne({ token });

    if (!verificationToken) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Check if the token is expired
    if (verificationToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    // Find the user associated with the token
    const user = await User.findById(verificationToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    await user.save();

    // Remove the used verification token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    res.status(200).json({ message: 'Email successfully verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
});

module.exports = router;