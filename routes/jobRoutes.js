const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { requireAuth, alreadyLoggedIn} = require('./middleware/authMiddleware');

router.get('/jobpost', (req, res) => {
  res.render('jobpost.ejs');
});

router.post('/jobpost', requireAuth, async (req, res) => {
  try {
    let { companyName, role, domain, location, skillsRequired, natureOfWork, jobPostingLink } = req.body;
    // Ensure skillsRequired is always an array
    if (!Array.isArray(skillsRequired)) {
      skillsRequired = skillsRequired.split(',').map(skill => skill.trim());
    }
    const job = new Job({ companyName, role, domain, location, skillsRequired, natureOfWork, jobPostingLink });
    await job.save();
    res.redirect('/');
  } catch (error) {
    console.error(`Failed to post job: ${error}`);
    res.status(500).json({ message: 'Failed to post job', error: error.message });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({}).select('+createdAt'); // Adjusted to include createdAt in the result set
    res.render('jobListing.ejs', { jobs });
  } catch (error) {
    console.error(`Failed to fetch jobs: ${error}`);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

module.exports = router;
```