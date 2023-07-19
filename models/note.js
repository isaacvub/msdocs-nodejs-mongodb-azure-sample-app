const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  positionX: Number,
  positionY: Number,
  width: Number,
  height: Number,
  content: String,
  color: String,
  type: String,
});

module.exports = mongoose.model('Note', noteSchema);