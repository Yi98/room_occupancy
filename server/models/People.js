const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
  time: { type: Date, required: true, default: Date.now() + 8*60*60*1000},
  data: { type: Number, required: true }
});

module.exports = mongoose.model('People', peopleSchema, 'people');