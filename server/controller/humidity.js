// ***Never delete Humidity variable. It needs to be reference in Room variable!
const Humidity = require('../models/Humidity');
const Room = require('../models/Room');

// get all humidity data of a room ->  /api/details/:roomId/humidity (GET)
exports.getHumidity = (req, res) => {
  Room.findById(req.params.roomId)
    .populate('humidity')
    .exec()
    .then(room => {
      if (!room) {
        return res.status(404).json({ message: `Humidity in room ${req.params.roomId} not found` })
      }
      res.status(200).json({humidity: room.humidity});
    })
    .catch(err => {
      res.status(500).json({
        message: `Failed to get humidty of room ${req.params.roomId}`,
        err
      })
    })  
}