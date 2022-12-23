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
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  Date: {
    type: Date,
    required: true,
    unique: false,
  },
  Time: {
    type: Date,
    required: true,
    unique: false,
  },
});
