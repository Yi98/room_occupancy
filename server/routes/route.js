const express = require('express');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/dashboard', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/dashboard.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/login.html'));
});

router.get('/chart/:roomId', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/chart.html'));
});

router.get('/report', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/report.html'));
});

router.get('/users', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/user.html'));
});

router.get('/resetPassword/:token', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/password_reset.html'));
})

router.get('/rooms', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/room.html'));
});

router.get('/profile', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/profile.html'));
});

//  Page not found
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/page_not_found.html'));
})

module.exports = router;