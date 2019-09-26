const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
  time: { type: Date, required: true },
  data: { type: Number, required: true },
});

module.exports = mongoose.model('People', temperatureSchema);