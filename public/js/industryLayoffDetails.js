// industryLayoffDetails.js

// Function to fetch layoff data
async function fetchLayoffData() {
    try {
        const response = await fetch('./layoff.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch layoff data:', error);
    }
}

// Function to parse fetched data and extract monthly layoff data for the last 6 months for each industry
function parseLayoffData(data) {
    let monthlyLayoffData = {};
    data.forEach(industryData => {
        // Assuming industryData has 'industry' and 'monthlyLayoffs' properties
        monthlyLayoffData[industryData.industry] = industryData.monthlyLayoffs.slice(-6);
    });
    return monthlyLayoffData;
}

// Function to dynamically generate links for each industry
function generateIndustryLinks(industryData) {
    const linksContainer = document.getElementById('industry-links');
    Object.keys(industryData).forEach(industry => {
        const link = document.createElement('a');
        link.href = '#';
        link.innerText = industry;
        link.addEventListener('click', () => updateLayoffChart(industry));
        linksContainer.appendChild(link);
    });
}

// Function to update the layoff chart
function updateLayoffChart(industry) {
    fetchLayoffData().then(data => {
        const monthlyData = parseLayoffData(data);
        const ctx = document.getElementById('layoffChartIndustry').getContext('2d');
        const chartData = {
            labels: ['Six Months Ago', 'Five Months Ago', 'Four Months Ago', 'Three Months Ago', 'Two Months Ago', 'Last Month'],
            datasets: [{
                label: `${industry} Industry Layoffs`,
                data: monthlyData[industry],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        };
        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }).catch(error => console.error('Failed to update layoff chart:', error));
}

// Initial data fetch and setup
fetchLayoffData().then(data => {
    const parsedData = parseLayoffData(data);
    generateIndustryLinks(parsedData);
}).catch(error => console.error('Failed to fetch and parse initial layoff data:', error));
```