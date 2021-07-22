// TODO: Add separate js file(s) for forms validation with preventDefault
// TODO?: Try most recommended way to add body-parser https://github.com/expressjs/body-parser ?
// TODO: Check if user data exist before creating user
// TODO: organize files
// TODO: schedules filtering by user
// Note: commented former code preserved due to educational reasons

const express = require('express');
const crypto = require('crypto');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const data = require('./data');
// const daysNames = require('./daysNames');

const port = 3000;
const { users, schedules } = data;
// const { getWeekDay } = daysNames;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static('public/css'));
app.use(express.static('src'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// Get the main page
app.get('/', (req, res) => {
  res.render('welcomePage', { title: 'Welcome', text: 'Welcome to our schedule website' });
});

// Get all users
app.get('/users', (req, res) => {
  res.render('users', { title: 'Users', users });
});

// Get a new user form
app.get('/users/new', (req, res) => {
  res.render('userNew', { title: 'New User' });
});

// Get a specific user
app.get('/users/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  if (users[userId] === undefined) {
    res.status(404).render('error', { title: 'error', text: `Incorrect user id: ${userId}` });
  }
  res.render('user', { title: `User ${userId}`, userId, user: users[userId] });
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
    res.status(404).render('error', { title: 'error', text: 'Please fill out all required fields' });
  }

  newUser.password = crypto.createHash('sha256')
    .update('newUser.password')
    .digest('hex');

  users.push(newUser);
  res.redirect('users');
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
    res.status(404).render('error', { title: 'error', text: `Incorrect user id: ${userId}` });
    res.redirect('/users');
  }

  // if (usersSchedules.length < 1) {
  //   res.render('error', { text: `No schedules for user ID:  ${userId}` });
  //   res.redirect('/users');
  // }

  // if (usersSchedules.length === 0) {
  //   res.render('userSchedules', {
  //  title: 'User schedules', text: `No schedules for user ID:  ${userId}` });
  // }

  res.render('userSchedules', {
    title: 'User schedules',
    text: `Schedules for user ID:  ${userId}`,
    users,
    user: users[userId],
    schedules,
    usersSchedules,
  });
});

// GET all schedules
app.get('/schedules', (req, res) => {
  res.render('schedules', { title: 'Schedules', schedules, users });
});

// Get a new schedule form
app.get('/schedules/new', (req, res) => {
  res.render('scheduleNew', { title: 'New Schedule', users });
});

// GET a specific schedule
app.get('/schedules/:scheduleId', (req, res) => {
  const scheduleId = Number(req.params.scheduleId);
  if (schedules[scheduleId] === undefined) {
    res.status(404).render('error', { title: 'error', text: `Incorrect schedule id: ${scheduleId}` });
  }
  res.render('schedule', { title: `Schedule ${scheduleId}`, schedule: schedules[scheduleId], users });
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
    res.status(404).render('error', { title: 'error', text: 'Please fill out all required fields' })
  }
  schedules.push(newSchedule);
  res.redirect('/schedules');
});

app.listen(port, () => {
  console.log(`Started on PORT ${port}`);
});
