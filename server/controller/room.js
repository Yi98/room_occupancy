const cacheSingleton = require('../class/Cache');
const Room = require('../models/Room');

const PeriodController = require('../controller/period');

// get one room with specific id ->  /api/rooms/:roomId (GET)
exports.getRoom = (req, res) => { 
  const period = req.query.period;
  let time, startingDate, endingDate;

  if (period == 'today') {
    time = PeriodController.getToday();
  }
  else if (period == 'yesterday') {
    time = PeriodController.getYesterday();
  }
  else if (period == 'weekly') {
    time = PeriodController.getLastWeek();
  }
  else if (period == 'monthly') {
    time = PeriodController.getLastMonth();
  }
  else if (period == 'yearly') {
    time = PeriodController.getLastYear();
  }
  else if (period == 'custom') {
    const startingDate = req.query.start;
    const endingDate = req.query.end;

    time = PeriodController.getCustomDate(startingDate, endingDate);
  }

  // console.log(time);
  startingDate = time.start;
  endingDate = time.end;

  Room.findById(req.params.roomId)  
    .populate({
      path: 'temperature',
      match: {$and: [
        {time: {$gte: new Date(startingDate)}},
        {time: {$lt: new Date(endingDate)}},
      ]},
      select: '-_id -__v'
    })
    .populate({
      path: 'humidity',
      match: {$and: [
        {time: {$gte: new Date(startingDate)}},
        {time: {$lt: new Date(endingDate)}},
      ]},
      select: '-_id -__v'
    })
    .populate({
      path: 'people',
      match: {$and: [
        {time: {$gte: new Date(startingDate)}},
        {time: {$lt: new Date(endingDate)}},
      ]},
      select: '-_id -__v'
    })
    .exec()
    .then(room => {
      if (!room) {
        return res.status(404).json({message: `Room ${req.params.roomId} not found`});
      }

      const key = req.params.roomId + '-' + req.query.period;

      success = cacheSingleton.set(key, room);

      res.status(200).json({room});
    })
    .catch(err => {
      res.status(500).json({
        message: `Failed to get room ${req.params.id}`,
        err
      });
    })
}


// get all rooms ->  /api/rooms (GET)
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

      // success = cacheSingleton.set("rooms", rooms);
      // console.log(success);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to get rooms',
        err
      });
    })
}

// get all rooms' details -> /api/rooms/details (GET)
exports.getRoomsDetails = (req, res) => {
  Room.find({}, {name: 1, maxCapacity: 1})
    .then(rooms => {
      if (!rooms) {
        return res.status(404).json({message: 'No rooms found'});
      }

      res.status(200).json({rooms});

      success = cacheSingleton.set("roomsDetails", rooms);
      // console.log(success);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to get rooms\'s details',
        err
      });
    })
};


// add a new room ->  /api/rooms (POST)
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


// delete a room ->  /api/room/:roomId (DELETE)
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