const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
  time: { type: String, required: true, default: Date(Date.now()).toString() },
  data: { type: Number, required: true }
});

module.exports = mongoose.model('People', peopleSchema, 'people');