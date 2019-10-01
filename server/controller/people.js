// ***Never delete People variable. It needs to be reference in Room variable!
const People = require('../models/People');
const Room = require('../models/Room');

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