const mongoose = require("mongoose");
require("dotenv/config")

exports.connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
};
