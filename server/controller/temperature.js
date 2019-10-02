// ***Never delete Temperature variable. It needs to be reference in Room variable!
const Temperature = require('../models/Temperature');
const Room = require('../models/Room');

let socket;

exports.temperatureSocket = (io) => {
  socket = io;
  socket.on("connection", function(socket) {
    console.log("temperature socket connected");
  })
}

// get all temperature data of a room ->  /api/data/:roomId/temperature (GET)
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
      });
    })  
};
 
// post new temperature data of a room ->  /api/data/:roomId/temperature (POST)
exports.postTemperature = (req, res) => {
  const currentTemp = new Temperature({data: req.body.data});
  console.log("Received Temperature");
  socket.emit("temperature", {data: req.body.data});
  res.status(200).json({message: 'Successfully post temperature data'});
  
  // currentTemp.save()
  //   .then(temp => {
  //     if (!temp) {
  //       return res.status(500).json({message: 'Failed to post temperature data'});
  //     }
  //     return Room.findById(req.params.roomId);
  //   })
  //   .then(room => {
  //     console.log(currentTemp);
  //     room.temperature.push(currentTemp);
  //     room.save();
  //     res.status(200).json({message: 'Successfully post temperature data'});
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: 'Failed to post temperature data',
  //       err
  //     });
  //   })
};

