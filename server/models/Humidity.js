const mongoose = require('mongoose');

const humiditySchema = mongoose.Schema({
  time: { type: Date, required: true, default: Date.now },
  data: { type: Number, required: true }
});

module.exports = mongoose.model('Humidity', humiditySchema, 'humidity');