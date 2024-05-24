const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('dotenv').config();

const { scheduleTrueupScrapper } = require('./trueupScheduler');

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.DB_CONNECTION_STRING }),
}));

app.set('view engine', 'ejs');

app.use(authRoutes);
app.use(jobRoutes);

app.get('/layoff-tracker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'layoff-tracker.html'));
});

app.get('/api/layoffs', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'hiring_data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading hiring_data.json:', err);
      return res.status(500).send('Could not read layoff data');
    }

    try {
      const layoffs = JSON.parse(data);
      const sixMonthsAgo = moment().subtract(6, 'months');
      const layoffsPerMonth = layoffs
        .filter(layoff => moment(layoff.date).isAfter(sixMonthsAgo))
        .reduce((acc, layoff) => {
          const month = moment(layoff.date).format('YYYY-MM');
          acc[month] = (acc[month] || 0) + layoff.layoffs;
          return acc;
        }, {});

      res.json(layoffsPerMonth);
    } catch (parseError) {
      console.error('Error parsing hiring_data.json:', parseError);
      res.status(500).send('Could not process layoff data');
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

scheduleTrueupScrapper();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```