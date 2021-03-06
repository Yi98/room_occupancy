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

module.exports = {
  getUsers,
  deleteUsers,
  getRoomsDetails,
  deleteRoomsDetails
};
