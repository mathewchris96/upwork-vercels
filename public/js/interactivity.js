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
            if (data.message === 'Applied to job successfully') {
                window.location.reload();
            }
            alert(data.message);
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
            if (data.message === 'Profile updated successfully') {
                window.location.reload();
            }
            alert(data.message);
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
            if (data.message === 'Job posted successfully') {
                window.location.reload();
            }
            alert(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function parseLayoffDataByIndustry(data) {
    const layoffsByIndustry = {};

    for (const key in data) {
        const item = data[key];
        if (item.length < 7) {
            console.error(`Data format error for key ${key}: Missing required fields.`);
            continue;
        }

        const industry = item[2];
        const layoffs = item[5];
        const date = new Date(item[6]);

        if (layoffs !== 'Number of employees laid off not available' && !isNaN(layoffs)) {
            if (!layoffsByIndustry[industry]) {
                layoffsByIndustry[industry] = [];
            }
            layoffsByIndustry[industry].push({ layoffs: parseInt(layoffs), date: date });
        }
    }
    return layoffsByIndustry;
}

function getLastSixMonthsLayoffs(layoffData) {
    const today = new Date();
    const layoffsPerMonth = {};

    layoffData.forEach(item => {
        const layoffDate = new Date(item.date);
        const monthDifference = (today.getFullYear() - layoffDate.getFullYear()) * 12 + (today.getMonth() - layoffDate.getMonth());
        if (monthDifference < 6) {
            const monthYearKey = layoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            layoffsPerMonth[monthYearKey] = (layoffsPerMonth[monthYearKey] || 0) + item.layoffs;
        }
    });

    return layoffsPerMonth;
}

function displayIndustryChart(industry, data) {
    const layoffsPerMonth = getLastSixMonthsLayoffs(data);

    const labels = Object.keys(layoffsPerMonth);
    const values = labels.map(label => layoffsPerMonth[label]);

    const ctx = document.getElementById('layoffChartIndustry').getContext('2d');
    document.getElementById('layoffChartIndustry').style.display = 'block';
    if (window.industryChart) {
        window.industryChart.destroy();
    }
    window.industryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: `Number of Layoffs for ${industry} (Last 6 Months)`,
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Number of Layoffs for ${industry} (Last 6 Months)`
                }
            }
        }
    });

    updateLayoffSummary(industry, values);
}

function updateLayoffSummary(industry, values) {
    const totalLayoffs = values.reduce((acc, val) => acc + val, 0);
    const peopleImpacted = totalLayoffs * 3; // Calculating total people impacted
    const days = 180; // 6 months * 30 days
    const peoplePerDay = peopleImpacted / days;
    const summaryText = `So far in 2024, The ${industry} industry has laid off ${totalLayoffs} people.`;
    document.getElementById('layoffSummary').innerText = summaryText;
    document.getElementById('layoffSummaryContainer').style.display = 'block';
}

fetch('layoff.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const layoffsByIndustry = parseLayoffDataByIndustry(data);

        const industryLinksContainer = document.getElementById('industry-links');
        Object.keys(layoffsByIndustry).forEach((industry, index) => {
            const link = document.createElement('a');
            link.href = "#";
            link.innerText = industry;
            link.onclick = () => {
                displayIndustryChart(industry, layoffsByIndustry[industry]);
            };
            industryLinksContainer.appendChild(link);
        });
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const industryLinksContainer = document.getElementById('industry-links');
        industryLinksContainer.innerHTML = `<p>Error loading layoff data: ${error.message}</p>`;
    });