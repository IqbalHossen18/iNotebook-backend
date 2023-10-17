const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // date: {
  //   type: Date,
  //   default: Date.toLocaleString(),
  // },
  date: {
    type: Date, // Store it as a string, not a Date object
    default: Date.toDateString, // Use the formatted date as the default value
  },
});

module.exports = mongoose.model("user", UserSchema);
