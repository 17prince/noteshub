const jwt = require("jsonwebtoken");
const { promisify } = require("node:util");
const User = require("../models/userModel");
// const AppError = require("./appError");

const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "90d",
  });

const verifyToken = async (authHeader) => {
  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return null;

  return currentUser;
};

module.exports = { signToken, verifyToken };
