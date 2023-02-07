const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Pets = Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: false,
  },
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
    type: String,
    required: true,
    unique: false,
  },
  weight: {
    type: String,
    required: true,
    unique: false,
  },
  health: {
    type: String,
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
  image: {
    type: String,
    required: true,
  },
  bookedFlag: {
    type: String,
    unique: false,
  },
});

module.exports = mongoose.model("Pets", Pets);
