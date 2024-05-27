const mongoose = require('mongoose');

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
    enum: ['Hybrid', 'Remote'],
  },
  jobPostingLink: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(value);
      },
      message: props => `${props.value} is not a valid URL!`,
    },
  },
  jobType: {
    type: String,
    required: false,
    trim: true,
  },
  Job_type: {
    type: String,
    required: false,
    trim: true,
  },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
```