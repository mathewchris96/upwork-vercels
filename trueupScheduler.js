const { exec } = require('child_process');
const cron = require('node-cron');

const executeTrueupScrapper = () => {
  exec('python ./trueup_scrapper.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing trueup_scrapper.py: ${error}`);
      return;
    }
    console.log(`Output: ${stdout}`);
    if (stderr) {
      console.error(`Error in script execution: ${stderr}`);
    }
  });
};

const scheduleTrueupScrapper = () => {
  cron.schedule('0 0 */2 * *', () => {
    executeTrueupScrapper();
    // Basic logic implemented for demonstration purposes.
    console.log('Trueup Scrapper scheduled to run every 2 hours.');
  });
};

module.exports = { scheduleTrueupScrapper };
```