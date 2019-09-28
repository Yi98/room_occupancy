// ***Never delete Temperature variable. It needs to be reference in Room variable!
const Temperature = require('../models/Temperature');
const Room = require('../models/Room');

// get all temperature data of a room ->  /api/details/:roomId/temperature (GET)
exports.getTemperature = (req, res) => {
  Room.findById(req.params.roomId)
    .populate('temperature')
    .exec()
    .then(room => {
      if (!room) {
        return res.status(404).json({ message: `Temperature in room ${req.params.roomId} not found` })
      }
      res.status(200).json({temperature: room.temperature});
    })
    .catch(err => {
      res.status(500).json({
        message: `Failed to get temperature of room ${req.params.roomId}`,
        err
      })
    })  
}