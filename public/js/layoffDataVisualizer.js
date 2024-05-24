fetch('layoff.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const totalLayoffs = calculateTotalLayoffs(data);
    renderBarGraph(totalLayoffs);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

function calculateTotalLayoffs(data) {
  return data.reduce((acc, current) => {
    const month = new Date(current.date).getMonth();
    if (!acc[month]) acc[month] = 0;
    acc[month] += current.layoffs;
    return acc;
  }, {});
}

function renderBarGraph(data) {
  const ctx = document.getElementById('layoff-chart').getContext('2d');
  const chartData = {
    labels: Object.keys(data).map(month => new Date(0, month, 1).toLocaleString('default', { month: 'long' })),
    datasets: [{
      label: 'Total Layoffs',
      data: Object.values(data),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  new Chart(ctx, config);
}