const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Pets = Schema({
  nickname: {
    type: String,
    required: true,
    unique: false,
  },
  breed: {
    type: String,
    required: true,
    unique: false,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
  },
  weight: {
    type: Number,
    required: true,
    unique: false,
  },
  color: {
    type: String,
    required: true,
    unique: false,
  },
  location: {
    type: String,
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model("Pets", Pets);
