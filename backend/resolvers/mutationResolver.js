const Notes = require("../models/notesModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { signToken } = require("../utils/auth");
const Email = require("../utils/email");

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

    if (!note) return new AppError("Document not found !", { code: "NO_DATA" });

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

    if (!note) return new AppError("Document not found !", { code: "NO_DATA" });

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

    // Send Welcome email
    await new Email(user).sendWelcome();

    return { token, user };
  },

  login: async (_, { email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    //   Check if user exist and the entered password matchs
    if (!user || !user.checkPassword(password, user.password))
      return new AppError("Incorrect email/password. Or user not found", {
        code: "IncorrectCredentials",
      });

    //   assing token
    const token = signToken(user._id);

    return { token, user };
  },
};
