const express = require('express');
const router = express.Router();

const DashboardController = require('../controller/dashboard');

router.get('/', DashboardController.getDashboard);

module.exports = router;