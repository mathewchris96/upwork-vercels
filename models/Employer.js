const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  workEmail: {
    type: String,
    required: [true, 'Please add a work email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  companyURL: {
    type: String,
    required: [true, 'Please add a company URL'],
    match: [
      /^(https?):\/\/[^\s$.?#].[^\s]*$/,
      'Please add a valid URL',
    ],
  },
  typesOfRolesHiringFor: [{
    type: String,
    required: true,
  }],
}, { timestamps: true });

// Middleware for hashing the password
employerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;