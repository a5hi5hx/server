// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const Booking = Schema({
//   uid: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     unique: false,
//   },
//   pid: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     unique: true,
//   },
//   time: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   Date: {
//     type: String,
//     required: true,
//     unique: false,
//   },
// });

// module.exports = mongoose.model("Booking", Booking);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserDetails = require("./user.detail.model");
const Pets = require("./pets.model");

const Booking = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  pet: {
    type: Schema.Types.ObjectId,
    ref: "Pets",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Booking", Booking);
