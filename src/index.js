// TODO: Try most recommended way to add body-parser https://github.com/expressjs/body-parser

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const data = require('./data');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
const port = 3000;
const { users } = data; // previously: const users = data.users - fixed by eslint
const { schedules } = data; // previously: const schedules = data.schedules - fixed by eslint

// Get the main page

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our schedule website' });
});

// Get all users

app.get('/users', (req, res) => {
  res.json(users);
});

// Get a specific user

app.get('/users/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  if (users[userId] === undefined) {
    res.status(404).json(`Incorrect user id: ${userId}`);
  }
  res.json(users[userId]);
});

// Post a new user with sha-256 hashed password

app.post('/users', (req, res) => {
  const newUser = {
    firstname: req.body.firstname.trim(),
    lastname: req.body.lastname.trim(),
    email: req.body.email.trim(),
    password: req.body.password.trim(),
  };

  if (!newUser.firstname || !newUser.lastname || !newUser.email || !newUser.password) {
    res.status(404).json('Please fill out all required fields');
  }

  newUser.password = crypto.createHash('sha256')
    .update('newUser.password')
    .digest('hex');

  // function hashPassword(pwd) {
  //   return crypto.createHash('sha256')
  //     .update(pwd)
  //     .digest('hex');
  // }

  // hashPassword(newUser.password);
  users.push(newUser);
  res.json(newUser);
});

// GET schedules for specific user

app.get('/users/:userId/schedules', (req, res) => {
  const userId = Number(req.params.userId);
  const usersSchedules = [];
  schedules.forEach((item) => {
    if (item.user_id === userId) {
      usersSchedules.push(item);
    }
  });
  if (users[userId] === undefined) {
    res.status(404).json(`Incorrect user id: ${userId}`);
  }
  if (usersSchedules.length === 0) {
    res.json('No schedules for this user');
  }
  res.json(usersSchedules);
});

// GET all schedules

app.get('/schedules', (req, res) => {
  res.json(schedules);
});

// GET a specific schedule

app.get('/schedules/:scheduleId', (req, res) => {
  const scheduleId = Number(req.params.scheduleId);
  if (schedules[scheduleId] === undefined) {
    res.status(404).json(`Incorrect schedule id: ${scheduleId}`);
  }
  res.json(schedules[scheduleId]);
});

// POST a new schedule

app.post('/schedules', (req, res) => {
  const newSchedule = {
    user_id: req.body.user_id.trim(),
    day: req.body.day.trim(),
    start_at: req.body.start_at.trim(),
    end_at: req.body.end_at.trim(),
  };

  if (!newSchedule.user_id || !newSchedule.day || !newSchedule.start_at || !newSchedule.end_at) {
    res.status(404).json('Please fill out all required fields');
  }
  schedules.push(newSchedule);
  res.json(newSchedule);
});

app.listen(port, () => {
  console.log(`Started on PORT ${port}`);
});
