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
  timePosted: {
    type: Date,
    required: true,
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
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
```