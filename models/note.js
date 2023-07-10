const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  notePosition: {
    positionX: Number,
    positionY: Number,
  },
  content: String,
  type: String,
});

module.exports = mongoose.model('Note', noteSchema);