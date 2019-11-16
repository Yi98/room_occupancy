const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const RoomController = require('../controller/room');

router.get('/:roomId', RoomController.getRoom);

router.get('/', RoomController.getRooms);

router.post('/', RoomController.addRoom);

router.delete('/:roomId', RoomController.deleteRoom);

module.exports = router;