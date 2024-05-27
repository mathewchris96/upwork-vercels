// Import necessary modules and packages
const cron = require('node-cron');
const { exec } = require('child_process');

// Define function to schedule scrapper
function scheduleScrapper() {
  // Schedule scrapper1.py to run every 2 days
  cron.schedule('0 0 */2 * *', () => {
    // Execute scrapper1.py using child_process.exec
    exec('python scrapper1.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  });
}

// Export scheduleScrapper for use in other files
module.exports = scheduleScrapper;
