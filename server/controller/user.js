const User = require('../models/User');

// get one user with specific id ->  /api/user/:id
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

// get all users ->  /api/users
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

exports.addUser = (req, res) => {
  // hash password
  const newUser = new User(req.body.username, req.body.email, req.body.password, req.body.role);
  return newUser.save();
}

exports.editUser = (req, res) => {

}

exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.body.id, (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log('deleted');
  })
}

exports.login = (req, res) => {

}





