const express = require('express');
const router = express.Router();

const TemperatureController = require('../controller/temperature');
const HumidityController = require('../controller/humidity');
const PeopleController = require('../controller/people');

router.get('/:roomId/temperature', TemperatureController.getTemperature);

router.get('/:roomId/humidity', HumidityController.getHumidity);

router.get('/:roomId/people', PeopleController.getPeople);

router.post('/:roomId/temperature', TemperatureController.postTemperature);

router.post('/:roomId/humidity', HumidityController.postHumidity);

router.post('/:roomId/people', PeopleController.postPeople);


module.exports = router;