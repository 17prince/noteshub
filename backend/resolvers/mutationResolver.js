const Notes = require("../models/notesModel");
const User = require("../models/userModel");
const { signToken } = require("../utils/auth");

exports.mutationResolver = {
  // Creates a new note
  createNote: async (_, { title, content }, context) => {
    return context.userId
      ? await Notes.create({
          title,
          content,
          createdAt: Date.now(),
          user: context.userId,
        })
      : null;
  },

  // Updates a note
  updateNote: async (_, { id, fields }, context) => {
    const note = await Notes.findOne({
      $and: [{ _id: id }, { user: context.userId }],
    });

    if (!note) return null;

    const updatedNote = await Notes.findByIdAndUpdate(id, fields, {
      new: true,
      runValidators: true,
    });

    return updatedNote;
  },

  //   Delete Note
  deleteNote: async (_, { id }, context) => {
    const note = await Notes.findOne({
      $and: [{ _id: id }, { user: context.userId }],
    });

    if (!note) return null;

    return context.userId ? await Notes.findByIdAndDelete(id) : null;
  },

  //   SignUp
  signup: async (_, { name, email, password }) => {
    const user = await User.create({
      name,
      email,
      password,
      createdAt: Date.now(),
    });

    //   assing token
    const token = signToken(user._id);

    //   make password undefined
    user.password = undefined;

    return { token, user };
  },

  login: async (_, { email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    //   Check if user exist and the entered password matchs

    if (!user || !user.checkPassword(password, user.password))
      return { token: undefined, user: null };

    //   assing token
    const token = signToken(user._id);

    return { token, user };
  },
};
