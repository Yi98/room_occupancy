const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cache = require('../middleware/cache');

const RoomController = require('../controller/room');

// router.get('/details', cache.getRoomsDetails, RoomController.getRoomsDetails);

router.get('/details', RoomController.getRoomsDetails);

router.get('/:roomId', RoomController.getRoom);

router.get('/', RoomController.getRooms);

router.post('/', cache.deleteRoomsDetails, RoomController.addRoom);

router.put('/:roomId', RoomController.editRoomName);

router.put('/:roomId', RoomController.editRoomMaxCapacity);

router.delete('/:roomId', RoomController.deleteRoom);

module.exports = router;