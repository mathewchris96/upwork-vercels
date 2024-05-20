const { exec } = require('child_process');
const cron = require('node-cron');

const executeTrueupScrapper = () => {
  exec('python trueup_scrapper.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing trueup_scrapper.py: ${error}`);
      return;
    }
    console.log(`Output: ${stdout}`);
  });
};

const scheduleTrueupScrapper = () => {
  cron.schedule('0 */2 * * *', () => {
    executeTrueupScrapper();
  });
};

module.exports = { scheduleTrueupScrapper };
```