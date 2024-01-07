const mongoose = require("mongoose");

exports.connectDatabase = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};
