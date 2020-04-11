const express = require('express');
const router = express.Router();

const forecastController = require('../controller/forecast');

router.get('/people', forecastController.forecastDailyPeople);

module.exports = router;