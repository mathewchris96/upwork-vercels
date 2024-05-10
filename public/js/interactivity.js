document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    handleLogin(username, password);
  });

  document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const bio = document.getElementById('bio').value;
    const jobsAppliedFor = Array.from(
      document.querySelectorAll('input[name="jobsApplied"]:checked')
    ).map((el) => el.value);
    updateProfile({ name, email, bio, jobsAppliedFor });
  });

  document.getElementById('applyJobForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const skillsRequired = formData
      .get('skillsRequired')
      .split(',')
      .map((skill) => skill.trim());
    const {
      companyName,
      role,
      domain,
      location,
      natureOfWork
    } = Object.fromEntries(formData.entries()); 
    const body = JSON.stringify({ companyName, role, domain, location, skillsRequired, natureOfWork });
    applyJob(body);
  });

  document.querySelector('a[href="#HireWithUpWork"]').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = '/jobpost';
  });
});

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { requireAuth } = require('./middleware/authMiddleware');

function applyJob(body) {
  fetch('/jobpost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      if (data.message === 'Applied to job successfully') {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error applying for job:', error);
      alert('An error occurred. Please try again.');
    });
}

function handleLogin(username, password) {
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Login successful') {
        window.location.href = '/profile';
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again later.');
    });
}

function updateProfile(profileData) {
  fetch('/api/user/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.message === 'Profile updated successfully') {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function submitJobPosting(jobData) {
  if (!jobData.jobTitle || !jobData.jobDescription || !jobData.jobRequirements || !jobData.jobCategory) {
    alert('Please fill in all required fields.');
    return;
  }

  if (typeof jobData.jobRequirements === 'string') {
    jobData.jobRequirements = jobData.jobRequirements.split(',').map(requirement => requirement.trim());
  }

  fetch('/jobs/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.message === 'Job posted successfully') {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}