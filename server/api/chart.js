const express = require('express');
const router = express.Router();

const ChartController = require('../controller/chart');

router.get('/', ChartController.getChart);

module.exports = router;