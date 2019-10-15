const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const crypto = require('crypto');

const User = require('../models/User');

// get one user with specific id ->  /api/users/:id (GET)
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
};

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
};


// add a new user ->  /api/users (POST)
exports.addUser = (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        return res.status(500).json({
          message: 'Email already existed',
          existing: user
        });
      }

      return bcrypt.hash(req.body.password, 15)
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
      console.log(user);
      res.status(201).json({
        message: 'New user was created',
        newUser: user
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to add user',
        err
      });
    })
};


// edit a user ->  /api/users/:id (PUT)
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
    .catch(err => {
      res.status(500).json({
        message: "Failed to change user's role",
        err
      })
    })
};


// delete a user ->  /api/users/:id (DELETE)
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
    .catch(err => {
      res.status(500).json({
        message: 'Failed to delete user',
        err
      });
    })
};


// check login cridentials -> /api/users/login (POST)
exports.login = (req, res) => {
  let fetchedUser;
    
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'Email is not recognized'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          status: 'fail',
          message: 'Wrong password'
        });
      }
      req.session.userId = fetchedUser._id;

      res.status(200).json({
        status: 'success',
        username: fetchedUser.username,
        role: fetchedUser.role
      })
    })
    .catch(err => {
      res.status(500).json({
        status: 'fail',
        message: 'Fail to login',
        err});
    })
};


// send reset link via email to the user that forgot password -> api/users/forgotPassword (POST)
exports.forgotPassword = (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(404).json({message: 'User does not exist'});
      }

      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token,
      user.resetPasswordExpires = Date.now() + 300000;  // link only active for 5 minutes
      user.save();
    
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'fyproomoccupancy@gmail.com',
              pass: 'fyp_room'
          }
      });

      const mailOptions = {
        from: '"FYP Team" fyproomoccupancy@gmail.com',
        to: `${user.email}`,
        subject: 'Link to password reset',
        html: `
        <h3>Hey ${user.username},</h3>
        <p>You recently requested to reset your password for your room occupancy account. Click the link below to reset it.</p>
        <a href="http://localhost:3000/resetPassword/${token}">Reset your password</a>
        <p>This link will only be active for 5 minutes</p>
        <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
        <p>Thanks,<br>FYP Team</p>`
      }
      
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {  
          console.log(`There was an err sending email ${err}`);
        }
        else {
          res.status(200).json({message: 'Recovery email sent to the user'});
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to send email to the user',
        err
      })
    })
};


// reset the password of the user ->  api/users/resetPassword (POST)
exports.resetPassword = (req, res) => {
  let fetchedUser;
  
  User.findOne({resetPasswordToken: req.body.token})
    .then(user => {
      if (!user) {
        return res.status(404).json({message: 'User not found'})
      }

      // console.log(user.resetPasswordExpires);
      // console.log(new Date());

      if (user.resetPasswordExpires < Date.now()) {
        return res.status(500).json({message: 'Reset password link has expired'});
      }

      fetchedUser = user;
      return bcrypt.hash(req.body.password, 15);
    })
    .then (hash => {
      fetchedUser.password = hash;
      fetchedUser.resetPasswordToken = null;
      fetchedUser.resetPasswordExpires = null;
      fetchedUser.save();

      return res.status(200).json({message: 'success'});
    })
    .catch (err => {
      return res.status(500).json({
        message: 'Failed to reset password',
        err
      });
    })
};