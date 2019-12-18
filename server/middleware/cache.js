const cacheSingleton = require('../class/Cache');

function getUsers(req, res, next) {
  const users = cacheSingleton.get("users");

  if (users) {
    // console.log("users found in cache");
    return res.status(200).json({users});
  }

  return next();
}

function deleteUsers(req, res, next) {
  cacheSingleton.del("users");

  return next();
}

function getRoomsDetails(req, res, next) {
  const rooms = cacheSingleton.get("roomsDetails");

  if (rooms) {
    // console.log("rooms found in cache");
    return res.status(200).json({rooms});
  }

  return next();
}

function deleteRoomsDetails(req, res, next) {
  cacheSingleton.del("roomsDetails");

  return next();
}

function getTodayData(req, res, next) {
  const key = req.params.roomId + '-' + req.query.period;

  const room = cacheSingleton.get(key);

  if (room) {
    // console.log("today data found in cache");
    return res.status(200).json({room});
  }

  return next();
}

function deleteTodayData(req, res, next) {
  const key = req.params.roomId + '-today';

  console.log(key + 'deleted');

  cacheSingleton.del(key);

  return next();
}

module.exports = {
  getUsers,
  deleteUsers,
  getRoomsDetails,
  deleteRoomsDetails,
  getTodayData,
  deleteTodayData
};
