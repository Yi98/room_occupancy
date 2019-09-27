const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  time: { type: String, required: true, default: Date(Date.now()).toString() },
  data: { type: Number, required: true }
});

module.exports = mongoose.model('People', peopleSchema);