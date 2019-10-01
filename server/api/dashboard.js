const express = require('express');
const router = express.Router();

const RoomController = require('../controller/room');

router.get('/', RoomController.getRooms);

module.exports = router;