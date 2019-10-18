const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const DataController = require('../controller/data');

router.get('/:roomId/temperature', auth, DataController.getTemperature);

router.get('/:roomId/humidity', auth, DataController.getHumidity);

router.get('/:roomId/people', auth, DataController.getPeople);

router.post('/:roomId/sensor', DataController.postSensorData);

router.post('/:roomId/people', DataController.postPeople);


module.exports = router;