const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

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

app.get('/opportunities', (req, res) => {
  const pythonProcess = spawn('python', ['./opportunities_ranking.py']);
  pythonProcess.stdout.on('data', (data) => {
    const topCompanies = JSON.parse(data.toString());
    res.json(topCompanies);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Failed to retrieve top hiring companies');
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```