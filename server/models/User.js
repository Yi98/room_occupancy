const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'staff' },
  resetPasswordToken: {type: String, required: false},
  resetPasswordExpires: {type: Date, required: false},
  firstLogin: {type: Boolean, default: true}
});

module.exports = mongoose.model('User', userSchema, 'users');