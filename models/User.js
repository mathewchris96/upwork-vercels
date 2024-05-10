const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  domainOfInterest: {
    type: String,
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },
  currentCompany: {
    type: String,
    trim: true,
  },
  currentLevel: {
    type: String,
    required: true,
  },
  jobsAppliedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
});

// Hashing the password before saving it to the database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare the password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Comparing password failed');
  }
};
module.exports = mongoose.model('User', userSchema);
