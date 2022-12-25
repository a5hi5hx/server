const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Booking = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: false,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
    unique: false,
  },
  time: {
    type: String,
    required: true,
    unique: false,
  },
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Booking", Booking);
