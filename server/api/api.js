const express = require('express');
const router = express.Router();

const mainController = require('../controller/main_controller');

router.get('/', mainController.getDashboard);

router.get('/login', mainController.getLogin);

router.get('/user', mainController.getUser);

router.get('/chart', mainController.getChart);

router.get('/report', mainController.getReport);

module.exports = router;