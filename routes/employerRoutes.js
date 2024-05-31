const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer.js');
const { requireAuth } = require('./middleware/authMiddleware');

function validateEmployerInput(name, email, password, companyName, companyUrl, rolesHiringFor) {
  return name && email && password && companyName && companyUrl && rolesHiringFor;
}

router.get('/register', (req, res) => {
  res.render('employerRegister');
});

router.post('/register', async (req, res) => {
  const { name, email, password, companyName, companyUrl, rolesHiringFor } = req.body;
  
  if (!validateEmployerInput(name, email, password, companyName, companyUrl, rolesHiringFor)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const existingEmployer = await Employer.findOne({ $or: [{ email }, { companyName }] });
    if (existingEmployer) {
      return res.status(400).json({ message: 'Employer already exists' });
    }

    const newEmployer = new Employer({ name, email, password, companyName, companyUrl, rolesHiringFor });
    await newEmployer.save();
    res.redirect('/employerLogin');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering new employer', error: error.message });
  }
});

router.get('/login', (req, res) => {
  res.render('employerLogin');
});

router.post('/login', async (req, res) => {
  try {
    const employer = await Employer.findByCredentials(req.body.email, req.body.password);
    const token = await employer.generateAuthToken();
    res.redirect('/jobpost');
  } catch (error) {
    console.error(error);
    res.status(400).send("Login failed");
  }
});

module.exports = router;