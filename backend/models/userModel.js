const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: [true, "Email is required !"],
    unique: [[true, "Email already exist"]],
  },
  password: {
    type: String,
    required: [true, "Password is required !"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Encrypt the password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.checkPassword = function (providedPassword, savedPassword) {
  return providedPassword === savedPassword;
};

module.exports = mongoose.model("Users", userSchema);
