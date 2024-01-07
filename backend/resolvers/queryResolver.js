const Notes = require("../models/notesModel");
const User = require("../models/userModel");

exports.queryResolver = {
  // Get a note with its id
  note: async (_, { id }, context) => {
    return context.userId
      ? await Notes.findOne({
          $and: [{ _id: id }, { user: context.userId }],
        })
      : null;
  },

  // Get all the notes belong to a user
  notes: async (_, args, context) => {
    return context.userId ? await Notes.find({ user: context.userId }) : null;
  },

  //   Get note with its title
  noteTitle: async (_, { title }, context) => {
    return context.userId
      ? await Notes.findOne({
          $and: [{ title }, { user: context.userId }],
        })
      : null;
  },

  //   Get a User
  user: async (_, args, context) => {
    return context.userId ? await User.findById(context.userId) : null;
  },
};
