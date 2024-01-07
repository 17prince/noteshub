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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "Note must belong to a user."],
  },
});

const Notes = mongoose.model("Notes", noteSchema);

module.exports = Notes;
