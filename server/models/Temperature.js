const mongoose = require('mongoose');

const temperatureSchema = mongoose.Schema({
  time: { type: Date, required: true, default: Date.now },
  data: { type: Number, required: true }
});

module.exports = mongoose.model('Temperature', temperatureSchema, 'temperature');