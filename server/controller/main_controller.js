const path = require('path');

exports.getDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/dashboard.html'));
}

exports.getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/login.html'));
}

exports.getUser = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/user.html'));
}

exports.getChart = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/chart.html'));
}

exports.getReport = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/report.html'));
}



