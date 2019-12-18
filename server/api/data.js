const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const cache = require('../middleware/cache');
const DataController = require('../controller/data');

router.get('/:roomId/temperature', DataController.getTemperature);

router.get('/:roomId/humidity', DataController.getHumidity);

router.get('/:roomId/people', DataController.getPeople);

router.post('/:roomId/sensor', cache.deleteTodayData, DataController.postSensorData);

router.post('/:roomId/people', cache.deleteTodayData, DataController.postPeople);


module.exports = router;