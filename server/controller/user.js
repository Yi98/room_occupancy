const User = require('../models/User');
const db_connection = require('../db_connection');


exports.getUser = (req, res) => {
}

exports.getUsers = (req, res) => {
  db_connection.connect(err => {
    const User = db_connection.db("RoomOccupancy").collection("User");

    User.find({}).toArray((err, users) => {
      if (err) {
        return res.status(500).json({err});
      }
      res.status(200).json({users});
    })

    db_connection.close();
});

  
}

exports.addUser = (req, res) => {
  
}

exports.editUser = (req, res) => {

}

exports.deleteUser = (req, res) => {

}

exports.login = (req, res) => {

}





