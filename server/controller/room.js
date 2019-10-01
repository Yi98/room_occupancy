const Room = require('../models/Room');

// get all rooms ->  /api/room (GET)
exports.getRooms = (req, res) => {
  Room.find({})
    .populate('temperature')
    .populate('humidity')
    .populate('people')
    .exec()
    .then(rooms => {
      if (!rooms) {
        return res.status(404).json({message: 'No rooms found'});
      }
      res.status(200).json({rooms});
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to get rooms',
        err
      });
    })
}


exports.addRoom = (req, res) => {
  const room = new Room({name: req.body.name});

  room.save()
    .then(room => {
      if (!room) {
        return res.status(500).json({message: 'Failed to add room'});
      }

      res.status(200).json({
        message: 'Successfully added room',
        room
      });
    })
    .catch(err => {
      res.status(500).json({message: 'Failed to add room'});
    })
};


exports.deleteRoom = (req, res) => {
  Room.findByIdAndDelete({_id: req.params.roomId})
    .then(room => {
      if (!room) {
        return res.status(404).json({message: `Room ${req.params.roomId} not found`});
      }

      res.status(200).json({
        message: `Room ${req.params.roomId} is deleted`,
        room
      });
    })
    .catch(err => {
      res.status(500).json({
        message: `Failed to deleted room ${req.params.roomId}`,
        err
      });
    })
}