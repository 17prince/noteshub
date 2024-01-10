const jwt = require("jsonwebtoken");
const { promisify } = require("node:util");
const User = require("../models/userModel");
const AppError = require("./appError");
// const AppError = require("./appError");

let jwtSecret = "THIS_IS_A_GRAPHQL";

const signToken = (id) =>
  jwt.sign({ id }, jwtSecret, {
    algorithm: "HS256",
    expiresIn: "90d",
  });

const verifyToken = async (authHeader) => {
  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, jwtSecret);
  } catch (error) {
    throw error;
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return new AppError("User not found!", { code: "USER_NOT_FOUND" });

  return currentUser;
};

module.exports = { signToken, verifyToken };
