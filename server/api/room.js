const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const RoomController = require('../controller/room');

router.get('/:roomId', auth, RoomController.getRoom);

router.get('/', auth, RoomController.getRooms);

router.post('/', RoomController.addRoom);

router.delete('/:roomId', auth, RoomController.deleteRoom);

module.exports = router;