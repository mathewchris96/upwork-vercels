document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        handleLogin(username, password);
    });

    document.getElementById("profileForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const bio = document.getElementById("bio").value;
        const jobsAppliedFor = Array.from(document.querySelectorAll('input[name="jobsApplied"]:checked')).map(el => el.value);
        updateProfile({ name, email, bio, jobsAppliedFor });
    });
    
    document.getElementById("applyJobForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const skillsRequired = formData.get('skillsRequired').split(',').map(skill => skill.trim());
        const { companyName, role, domain, location, natureOfWork } = Object.fromEntries(formData.entries()); // Convert FormData to object
        const body = JSON.stringify({ companyName, role, domain, location, skillsRequired, natureOfWork });
        applyJob(body);
    });

    // Add an event listener for the "Hire with UpWork" link
    const hireWithUpWorkLink = document.querySelector('a[href="#HireWithUpWork"]');
    if (hireWithUpWorkLink) {
        hireWithUpWorkLink.addEventListener("click", function(e) {
            e.preventDefault();
            window.location.href = "/jobpost";
        });
    }
});

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { requireAuth } = require('./middleware/authMiddleware');

function applyJob(body) {
    // existing code
}

function handleLogin(username, password) {
    // existing code
}

function updateProfile(profileData) {
    // existing code
}

function submitJobPosting(jobData) {
    // existing code
}

function validateEmail(email) {
    // existing code