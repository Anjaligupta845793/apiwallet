const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please provide email address"],
  },
  password: {
    type: String,
    required: [true, "please provide us your password"],
    minlength: 8,
  },
  balance: {
    type: Number,
    default: 100,
  },
  otp: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

exports.User = mongoose.model("User", userSchema);

//module.exports = addUser;
