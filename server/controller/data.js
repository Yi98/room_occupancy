// ***Never delete Temperature, Humidity and People variable. It needs to be reference in Room variable!
const Temperature = require('../models/Temperature');
const Humidity = require('../models/Humidity');
const People = require('../models/People');
const Room = require('../models/Room');
const fs = require("fs");
const date = require('date-and-time');

const path = "people.txt"

let socket;

exports.sensorSocket = (io) => {
  socket = io;

  io.on("connection", function (socket) {
    // console.log("sensor socket connected");
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

      res.status(200).json({ temperature: room.temperature });
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
      res.status(200).json({ humidity: room.humidity });
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
      res.status(200).json({ people: room.people });
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

  if (req.body.store != 'true') {
    socket.emit("sensor", { temperature: req.body.tempData, humidity: req.body.humidData, roomId: req.params.roomId, store: false });
    return res.status(200).json({ message: 'Successfully push sensor data to client' });
  } else {
    socket.emit("sensor", { temperature: req.body.tempData, humidity: req.body.humidData, roomId: req.params.roomId, store: true });
  }

  if (req.body.store == 'true') {
    Room.findById(req.params.roomId)
      .then(room => {
        if (!room) {
          return res.status(404).json({ message: `Room ${req.params.roomId} not found` });
        }

        fetchedRoom = room;
        const currentTemp = new Temperature({ data: req.body.tempData, time: Date(req.body.datetime) });
        return currentTemp.save();
      })
      .then(temp => {
        if (!temp) {
          return res.status(500).json({ message: 'Failed to post temperature data' });
        }

        fetchedRoom.temperature.push(temp);
        const currentHumid = new Humidity({ data: req.body.humidData, time: Date(req.body.datetime) });
        return currentHumid.save();
      })
      .then(humid => {
        if (!humid) {
          return res.status(500).json({ message: 'Failed to post humidity data' });
        }

        fetchedRoom.humidity.push(humid);
        return fetchedRoom.save();
      })
      .then(room => {
        if (!room) {
          return res.status(404).json({ message: 'Fail to post temperature data to room' });
        }

        res.status(200).json({ message: 'Successfully post temperature and humidity data' });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Failed to post temperature data',
          err
        });
      })
  }
};

// post number of people of a room ->  /api/data/:roomId/people (POST)
exports.postPeople = (req, res) => {
  let fetchedRoom;
  let socketPeopleCount;
  let found = false;

  // If the file not exist, create the file
  if (!fs.existsSync(path)) {
    let a = fs.writeFile("people.txt", "", (err) => {
      if (err) throw err;
    });
    // Here add the room id and the number of people, separate by ':'
    fs.appendFileSync("people.txt", req.params.roomId + ":" + req.body.data + "\n");

    // socket.emit("people", {people: req.body.data, roomId: req.params.roomId, store: true});

  }
  // else {
  let t1 = fs.openSync(path, "r");
  let bufferSize = 1024;
  let buffer = new Buffer.alloc(bufferSize);

  let leftOver = "";
  let read, line, idxStart, idx;
  while ((read = fs.readSync(t1, buffer, 0, bufferSize, null)) !== 0) {
    leftOver += buffer.toString('utf8', 0, read);
    idxStart = 0
    while ((idx = leftOver.indexOf("\n", idxStart)) !== -1) {
      line = leftOver.substring(idxStart, idx);
      idxStart = idx + 1;

      let semicolon = line.indexOf(":");
      let roomId = line.slice(0, semicolon).trim();
      let previousPeopleCount = line.slice(semicolon + 1, line.length).trim();

      // Check whether the line's room id whether it is identical to the http request room id
      if (roomId == req.params.roomId) {
        found = true;
        // Regular Expression for string that match the 
        let re = new RegExp(line, "g");

        // Read the file 
        fs.readFile("people.txt", "utf-8", function (err, data) {
          let newPeopleCount = data.replace(re, (roomId + ":" + String(parseInt(previousPeopleCount) + parseInt(req.body.data))));
          socketPeopleCount = "" + String(parseInt(previousPeopleCount) + parseInt(req.body.data));

          // if (req.body.store != true) {
          //   socket.emit("people", {people: socketPeopleCount, roomId: req.params.roomId, store: false});
          // } else {
          //   socket.emit("people", {people: socketPeopleCount, roomId: req.params.roomId, store: true});
          // }

          socket.emit("people", { previous: previousPeopleCount, people: socketPeopleCount, roomId: req.params.roomId, store: true });

          // Replace the line to new line with updated value
          fs.writeFile("people.txt", newPeopleCount, "utf-8", function (err) {
            if (err) {
              return console.log("Error changing the value of the " + req.params.roomId);
            }
          })
        })
      }
    }

    leftOver = leftOver.substring(idxStart);
  }
  // }

  if (found == false) {
    fs.appendFileSync("people.txt", req.params.roomId + ":" + req.body.data + "\n");
    socket.emit("people", { people: req.body.data, roomId: req.params.roomId, store: true });
  }

  if (req.body.store != 1) {
    return res.status(200).json({ message: 'Successfully push people data to client' });
  }

  Room.findById(req.params.roomId)
    .then(room => {
      if (!room) {
        return res.status(404).json({ message: `Room ${req.params.roomId} not found` });
      }

      fetchedRoom = room;
      const currentPeople = new People({ data: socketPeopleCount });
      return currentPeople.save();
    })
    .then(people => {
      if (!people) {
        return res.status(500).json({ message: 'Failed to create people object' });
      }

      fetchedRoom.people.push(people);
      return fetchedRoom.save();
    })
    .then(room => {
      if (!room) {
        return res.status(404).json({ message: 'Fail to post number of people to room' });
      }

      res.status(200).json({ message: 'Successfully post number of people' });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to post number of people',
        err
      });
    })
};