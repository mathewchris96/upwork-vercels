const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer.js');

// Middleware for validating employer input
function validateEmployerInput(name, email, password, companyName, companyUrl, rolesHiringFor) {
  return name && email && password && companyName && companyUrl && rolesHiringFor;
}

// Route for rendering the employer registration form
router.get('/employerRegister', (req, res) => {
  res.render('employerRegister');
});

// Route for handling employer registration
router.post('/employerRegister', async (req, res) => {
  const { name, email, password, companyName, companyUrl, rolesHiringFor } = req.body;
  
  console.log("Received registration data:", req.body); // Debug logging
  
  if (!validateEmployerInput(name, email, password, companyName, companyUrl, rolesHiringFor)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const existingEmployer = await Employer.findOne({ $or: [{ email }] });
    if (existingEmployer) {
      return res.status(400).json({ message: 'Employer already exists' });
    }

    const newEmployer = new Employer({ name, email, password, companyName, companyUrl, rolesHiringFor });
    await newEmployer.save();
    res.redirect('/employerLogin'); // Corrected redirection path for consistency
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering new employer', error: error.message });
  }
});

// Route for rendering the employer login form
router.get('/employerLogin', (req, res) => {
  res.render('employerLogin');
});

// Route for handling employer login
router.post('/employerLogin', async (req, res) => {
  try {
    // Logic for verifying employer credentials
    const employer = await Employer.findByCredentials(req.body.email, req.body.password);
    const token = await employer.generateAuthToken();
    
    // Store token in a cookie or session
    // Assuming session-based authentication for simplicity
    req.session.token = token;
    
    res.redirect('/jobpost'); // Redirect to /jobpost after successful login
  } catch (error) {
    console.error(error);
    res.status(400).send("Login failed");
  }
});

module.exports = router;
