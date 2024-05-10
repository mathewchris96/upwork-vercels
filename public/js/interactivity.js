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
        const domainOfInterest = document.getElementById("domainOfInterest").value;
        const linkedinUrl = document.getElementById("linkedinUrl").value;
        const currentCompany = document.getElementById("currentCompany").value;
        const currentLevel = document.getElementById("currentLevel").value;
        updateProfile({ name, email, bio, jobsAppliedFor, domainOfInterest, linkedinUrl, currentCompany, currentLevel });
    });
    
    // ... (other event listeners)

});

// ... (other functions)

function updateProfile(profileData) {
    fetch('/api/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Profile updated successfully') {
            window.location.reload();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
