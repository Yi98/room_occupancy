const bcrypt = require('bcrypt');
const session = require('express-session');

const User = require('../models/User');

// get one user with specific id ->  /api/user/:id (GET)
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


// get all users ->  /api/user (GET)
exports.getUsers = (req, res) => {
  User.find({})
    .exec()
    .then(users => {
      if (!users) {
        return res.status(404).json({message: 'Users not found'})
      }
      console.log(req.session.userId);
      res.status(200).json({users});
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to get users',
        err
      })
    })
}


// add a new user ->  /api/user (POST)
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
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).json({message: `User ${req.params.id} not found`});
      }

      if (user.role == 'staff') {
        user.role = 'manager';
      }
      else if (user.role == 'manager') {
        user.role = 'staff';
      }

      return user.save();
    })
    .then(updatedUser => {
      res.status(200).json({
        message: "User's role has been changed",
        updatedUser
      });
    })
}


// delete a user ->  /api/user/:id (DELETE)
exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({message: `User ${req.params.id} was not found`});
      }
      return res.status(200).json({
        message: 'User was succesfully deleted',
        deletedUser
      })
    })
}


// check login cridentials -> /api/user/login (POST)
exports.login = (req, res) => {
  let fetchedUser;

  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Email is not recognized'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({message: 'Login credentials invalid'});
      }
      req.session.userId = fetchedUser._id;

      res.status(200).json({
        username: fetchedUser.username,
        role: fetchedUser.role
      })
    })
}