const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const cache = require('../middleware/cache');
const DataController = require('../controller/data');

router.get('/:roomId/temperature', DataController.getTemperature);

router.get('/:roomId/humidity', DataController.getHumidity);

router.get('/:roomId/people', DataController.getPeople);

router.post('/:roomId/sensor', DataController.postSensorData);

router.post('/:roomId/people', DataController.postPeople);

router.put('/:roomId/people', DataController.putPeople);

// bong testing
router.get("/:roomId/people/real-time", DataController.getRealTimePeople);


module.exports = router;