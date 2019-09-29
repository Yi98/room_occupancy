const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
  time: { type: Date, required: true, default: Date.now },
  data: { type: Number, required: true }
});

module.exports = mongoose.model('People', peopleSchema, 'people');