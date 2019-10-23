// ***Never delete Temperature, Humidity and People variable. It needs to be reference in Room variable!
const Temperature = require('../models/Temperature');
const Humidity = require('../models/Humidity');
const People = require('../models/People');
const Room = require('../models/Room');

let socket;

exports.sensorSocket = (io) => {
  socket = io;
  console.log("Ehe");
  socket.on("connection", function(socket) {
    console.log("sensor socket connected");
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


// get all number of people data of a room ->  /api/data/:roomId/people (GET)
exports.getPeople = (req, res) => {
  Room.findById(req.params.roomId)
    .populate('people')
    .exec()
    .then(room => {
      if (!room) {
        return res.status(404).json({ message: `Number of people in room ${req.params.roomId} not found` })
      }
      res.status(200).json({people: room.people});
    })
    .catch(err => {
      res.status(500).json({
        message: `Failed to get number of people of room ${req.params.roomId}`,
        err
      });
    })  
};
 

// post temp and humid data of a room ->  /api/data/:roomId/sensor (POST)
exports.postSensorData = (req, res) => {
  let fetchedRoom;
  // need store parameter
  socket.emit("sensor", {temperature: req.body.tempData, humidity: req.body.humidData, roomId: req.params.roomId});
  Room.findById(req.params.roomId)
    .then(room => {
      if (!room) {
        return res.status(404).json({message: `Room ${req.params.roomId} not found`});
      }

      fetchedRoom = room;
      const currentTemp = new Temperature({data: req.body.tempData});
      return currentTemp.save();
    })
    .then(temp => {
      if (!temp) {
        return res.status(500).json({message: 'Failed to post temperature data'});
      }
      
      fetchedRoom.temperature.push(temp);
      const currentHumid = new Humidity({data: req.body.humidData});
      return currentHumid.save();
    })
    .then(humid => {
      if (!humid) {
        return res.status(500).json({message: 'Failed to post humidity data'});
      }

      fetchedRoom.humidity.push(humid);
      return fetchedRoom.save();
    })
    .then (room => {
      if (!room) {
        return res.status(404).json({message: 'Fail to post temperature data to room'});
      }

      res.status(200).json({message: 'Successfully post temperature and humidity data'});
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to post temperature data',
        err
      });
    })
};


// post number of people of a room ->  /api/data/:roomId/people (POST)
exports.postPeople = (req, res) => {
  let fetchedRoom;

  Room.findById(req.params.roomId)
    .then(room => {
      if (!room) {
        return res.status(404).json({message: `Room ${req.params.roomId} not found`});
      }

      fetchedRoom = room;
      const currentPeople = new People({data: req.body.data});
      return currentPeople.save();
    })
    .then(people => {
      if (!people) {
        return res.status(500).json({message: 'Failed to post number of people'});
      }

      fetchedRoom.people.push(people);
      return fetchedRoom.save();
    })
    .then (room => {
      if (!room) {
        return res.status(404).json({message: 'Fail to post number of people to room'});
      }

      res.status(200).json({message: 'Successfully post number of people'});
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to post number of people',
        err
      });
    })
};