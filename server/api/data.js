const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const DataController = require('../controller/data');

router.get('/:roomId/temperature', DataController.getTemperature);

router.get('/:roomId/humidity', DataController.getHumidity);

router.get('/:roomId/people', DataController.getPeople);

router.post('/:roomId/sensor', DataController.postSensorData);

router.post('/:roomId/people', DataController.postPeople);


module.exports = router;