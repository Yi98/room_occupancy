const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: { type: String, required: true },
  maxCapacity: {type: Number, default: 50},
  temperature: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Temperature', default: [] }],
  humidity: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Humidity', default: [] }],
  people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'People', default: [] }],
});

module.exports = mongoose.model('Room', roomSchema, 'rooms');