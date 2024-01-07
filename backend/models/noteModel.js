const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide the title"],
  },

  content: String,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Notes = mongoose.model("Notes", noteSchema);

module.exports = Notes;
