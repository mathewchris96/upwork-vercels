const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { requireAuth, alreadyLoggedIn } = require('./middleware/authMiddleware');

router.get('/jobpost', (req, res) => {
  res.render('jobpost.ejs');
});

router.post('/jobpost', requireAuth, async (req, res) => {
  try {
    const { companyName, role, domain, location, skillsRequired, natureOfWork, jobPostingLink, contactEmail } = req.body; // Added contactEmail field
    const job = new Job({ companyName, role, domain, location, skillsRequired, natureOfWork, jobPostingLink, contactEmail }); // Added contactEmail to the job data
    await job.save();
    res.status(201).json({ message: 'Posted job successfully', job });
  } catch (error) {
    console.error(`Failed to post job: ${error}`);
    res.status(500).json({ message: 'Failed to post job', error: error.message });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.render('jobListing.ejs', { jobs });
  } catch (error) {
    console.error(`Failed to fetch jobs: ${error}`);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

module.exports = router;