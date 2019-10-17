const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/dashboard.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/login.html'));
});

router.get('/chart/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/chart.html'));
});

router.get('/report', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/report.html'));
});

router.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/user.html'));
});

router.get('/resetPassword/:token', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/password_reset.html'));
})

//  Page not found
router.get('*', (req, res) => {
  res.send("Page not found");
  // res.redirect('/dashboard');
})

module.exports = router;