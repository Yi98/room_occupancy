const bcrypt = require('bcrypt');

const User = require('../models/User');

// * = complete implementation

// *get one user with specific id ->  /api/user/:id (GET)
exports.getUser = (req, res) => {
  User.findById({_id: req.params.id})
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json({user});
    })
    .catch(err => {
      res.status(500).json({
        message: `Failed to get user ${req.params.id}`,
        err
      })
    })
}


// *get all users ->  /api/user (GET)
exports.getUsers = (req, res) => {
  User.find({})
    .exec()
    .then(users => {
      if (!users) {
        return res.status(404).json({message: 'Users not found'})
      }
      res.status(200).json({users});
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to get users',
        err
      })
    })
}


// *add a new user ->  /api/user (POST)
exports.addUser = (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        return res.status(500).json({
          message: 'Email already existed',
          existing: user
        });
      }

      return bcrypt.hash(req.body.password, 5)
    })
    .then(hash => {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role
      });

      return newUser.save();
    })
    .then(user => {
      res.status(201).json({
        message: 'New user was created',
        newUser: user
      })
    })
    .catch(err => {
      res.status(500).json({message: 'Failed to add user'});
    })
}


// edit a user ->  /api/user/:id (PUT)
exports.editUser = (req, res) => {

}


// delete a user ->  /api/user/:id (DELETE)
exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.body.id, (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log('deleted');
  })
}


// check login cridentials -> /api/user/login (POST)
exports.login = (req, res) => {

}





