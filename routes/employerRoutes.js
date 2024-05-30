const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer.js');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// Route for rendering the employer registration form
router.get('/employerRegister', (req, res) => {
  res.render('employerRegister');
});

// Route for handling employer registration
router.post('/employerRegister', validationMiddleware, async (req, res) => {
  try {
    const newEmployer = new Employer(req.body);
    await newEmployer.save();
    res.redirect('/employerLogin');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering new employer");
  }
});

// Route for rendering the employer login form
router.get('/employerLogin', (req, res) => {
  res.render('employerLogin');
});

// Route for handling employer login
router.post('/employerLogin', authenticationMiddleware, async (req, res) => {
  try {
    // Logic for verifying employer credentials
    const employer = await Employer.findByCredentials(req.body.email, req.body.password);
    const token = await employer.generateAuthToken();
    res.send({ employer, token });
  } catch (error) {
    console.error(error);
    res.status(400).send("Login failed");
  }
});

module.exports = router;