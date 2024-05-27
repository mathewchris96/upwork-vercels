const { exec } = require('child_process');
const cron = require('node-cron');

const scheduleScrapperTask = () => {
  exec('python scrapper1.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing scrapper1.py: ${error}`);
      return;
    }
    console.log(`Output: ${stdout}`);
  });
};

const scheduleTrueupScrapper = () => {
  cron.schedule('0 */3 * * *', () => {
    scheduleScrapperTask();
  });
};

module.exports = { scheduleTrueupScrapper };
```