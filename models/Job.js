// Importing Mongoose library to create schemas and models
const mongoose = require('mongoose');

// Job Schema definition
const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  domain: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  skillsRequired: [{
    type: String,
    required: true,
  }],
  natureOfWork: {
    type: String,
    required: true,
    enum: ['Hybrid', 'Remote'], // Ensures the value is one of the two specified
  },
  jobPostingLink: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        // Validate URL format
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(value);
      },
      message: props => `${props.value} is not a valid URL!`,
    },
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Creating the Job model from the schema
const Job = mongoose.model('Job', jobSchema);

// Exporting the Job model to be used in routes/jobRoutes.js
module.exports = Job;
