const mongoose = require('mongoose');

const humiditySchema = mongoose.Schema({
  time: { type: String, required: true, default: Date(Date.now()).toString() },
  data: { type: Number, required: true }
});

module.exports = mongoose.model('Humidity', humiditySchema, 'humidity');