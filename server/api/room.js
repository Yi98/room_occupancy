const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cache = require('../middleware/cache');

const RoomController = require('../controller/room');

router.get('/details', RoomController.getRoomsDetails);

router.get('/:roomId', RoomController.getRoom);

router.get('/', RoomController.getRooms);

router.post('/', RoomController.addRoom);

router.put('/:roomId', RoomController.editRoom);

router.delete('/:roomId', RoomController.deleteRoom);

module.exports = router;