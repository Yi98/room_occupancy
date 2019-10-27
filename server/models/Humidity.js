const mongoose = require('mongoose');

const humiditySchema = mongoose.Schema({
  time: { type: Date, required: true, default: Date.now() + 8*60*60*1000},
  data: { type: Number, required: true }
});

module.exports = mongoose.model('Humidity', humiditySchema, 'humidity');