// ***Never delete Humidity variable. It needs to be reference in Room variable!
const Humidity = require('../models/Humidity');
const Room = require('../models/Room');

// get all humidity data of a room ->  /api/data/:roomId/humidity (GET)
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
      });
    })  
};


// post new humidity data of a room ->  /api/data/:roomId/humidity (POST)
exports.postHumidity = (req, res) => {
  const currentHumid = new Humidity({data: req.body.data});
  currentHumid.save()
    .then(humid => {
      if (!humid) {
        return res.status(500).json({message: 'Failed to post humidity data'});
      }
      return Room.findById(req.params.roomId);
    })
    .then(room => {
      console.log(currentHumid);
      room.humidity.push(currentHumid);
      room.save();
      res.status(200).json({message: 'Successfully post humidity data'});
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to post humidity data',
        err
      });
    })
};