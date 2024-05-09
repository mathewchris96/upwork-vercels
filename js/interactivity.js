

// Disclaimer: The following interactions are simulated for demonstration purposes. 
// In a real application, interactions such as form submissions and updates would require server communication logic or API calls.

// Function to handle login form submission
function handleLogin(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log(`Logging in with username: ${username} and password: ${password}`);
    
    // Simulate successful login
    alert('Login successful!');
    window.location.href = 'profile.html'; // Redirect to profile page on successful login
}

// Function to update user profile information
function updateProfile({ name, email, bio }) {
    console.log(`Updating profile with name: ${name}, email: ${email}, bio: ${bio}`);
    
    // Simulate successful profile update
    alert('Profile updated successfully!');
    window.location.href = 'job-listing.html'; // Redirect to job-listing page after successful profile update
}

// Function to handle job posting form submission
function submitJobPosting({ jobTitle, companyName, position, salary, description }) {
    console.log(`Posting job with title: ${jobTitle}, company: ${companyName}, position: ${position}, salary: ${salary}, description: ${description}`);
    
    // Simulate successful job posting
    alert('Job posted successfully!');
}

// Function to apply for a job
function applyJob() {
    console.log('Applying for job');
    
    // Simulate successful job application
    alert('Applied for job successfully!');
}

// Function to save a job for later
function saveJob() {
    console.log('Saving job');
    
    // Simulate successful job save
    alert('Job saved successfully!');
}

// Implementing button hover effects
function addHoverEffects() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f0f0f0'; // Change button color on hover
            this.style.cursor = 'pointer'; // Change cursor to pointer on hover
        });

        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = ''; // Reset button color when not hovering
        });
    });
}

// Add event listeners if necessary
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const profileForm = document.getElementById('profileForm');
    const jobPostForm = document.getElementById('jobPostForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            updateProfile({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                bio: document.getElementById('bio').value
            });
        });
    }
    
    if (jobPostForm) {
        jobPostForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitJobPosting({
                jobTitle: document.getElementById('jobTitle').value,
                companyName: document.getElementById('companyName').value,
                position: document.getElementById('position').value,
                salary: document.getElementById('salary').value,
                description: document.getElementById('description').value
            });
        });
    }

    // Activate button hover effects
    addHoverEffects();
});
