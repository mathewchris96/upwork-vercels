const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { requireAuth, alreadyLoggedIn } = require('./middleware/authMiddleware');
const { calculateCosineSimilarity } = require('../utils/cosineSimilarity');

router.get('/jobpost', (req, res) => {
  res.render('jobpost.ejs');
});

router.post('/jobpost', requireAuth, async (req, res) => {
  try {
    const { companyName, role, domain, location, skillsRequired, natureOfWork, jobPostingLink } = req.body;
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
    const jobs = await Job.find({});
    res.render('jobListing.ejs', { jobs });
  } catch (error) {
    console.error(`Failed to fetch jobs: ${error}`);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

router.post('/api/job/compatibility', async (req, res) => {
  try {
    const { userProfile, jobDescription } = req.body;
    const compatibilityScore = calculateCosineSimilarity(userProfile, jobDescription);
    res.json({ compatibilityFile score });
  } catch (error) {
    console.error(`Failed to calculate compatibility: ${error}`);
    res.status(500).json({ message: 'Failed to calculate compatibility', error: error.message });
  }
});

module.exports = router;
```