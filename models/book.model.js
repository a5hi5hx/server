const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Booking = Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: false,
  },
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  time: {
    type: String,
    required: true,
    unique: false,
  },
  Date: {
    type: String,
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model("Booking", Booking);
