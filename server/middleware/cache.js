const cacheSingleton = require('../models/Cache');

function getUsers(req, res, next) {
  const users = cacheSingleton.get("users");

  if (users) {
    // console.log("users found in cache");
    return res.status(200).json({users});
  }

  return next();
}

module.exports = { getUsers };
