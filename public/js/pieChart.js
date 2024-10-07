
import Chart from 'chart.js/auto';

export function initializePieChart(data) {
    // Format data if necessary
    const formattedData = data.map(item => ({
        label: item.label,
        value: item.value
    }));

    const ctx = document.getElementById('layoffChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: formattedData.map(item => item.label),
            datasets: [{
                data: formattedData.map(item => item.value),
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
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}