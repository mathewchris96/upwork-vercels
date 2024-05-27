const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const fs = require('fs');
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
  const filePath = path.join(__dirname, 'data', 'layoff.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading layoff.json file:', err);
      return res.status(500).send('Could not read layoff data');
    }
    try {
      const layoffs = JSON.parse(data);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentLayoffs = layoffs.filter(layoff => {
        const layoffDate = new Date(layoff.date);
        return layoffDate >= sixMonthsAgo;
      });

      res.render('layoff-tracker', { recentLayoffs });
    } catch (parseError) {
      console.error('Error parsing layoff.json data:', parseError);
      res.status(500).send('Error processing layoff data');
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