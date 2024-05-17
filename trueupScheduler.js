// Import necessary modules
const { exec } = require('child_process');
const cron = require('node-cron');

// Define function to execute the Python script
const executeTrueupScrapper = () => {
  exec('python trueup_scrapper.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing trueup_scrapper.py: ${error}`);
      return;
    }
    console.log(`Output: ${stdout}`);
  });
};

// Define function to schedule the execution of the Python script
const scheduleTrueupScrapper = () => {
  cron.schedule('0 0 */2 * *', () => {
    executeTrueupScrapper();
  });
};

// Export the scheduling function
module.exports = scheduleTrueupScrapper;
```