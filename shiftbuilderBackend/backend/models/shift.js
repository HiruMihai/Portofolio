// models/shift.js

const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  wage: { type: Number, required: true },
  workplace: { type: String, required: true },
  name: { type: String, required: true },
  comments: { type: String, required: true }
});

module.exports = mongoose.model('Shift', shiftSchema);
