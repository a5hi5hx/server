// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const UserDetails = Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   phone: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   mobile: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   address: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// });

// module.exports = mongoose.model("UserDetails", UserDetails);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetails = Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  phone: {
    type: String,
    required: true,
    unique: false,
  },
  mobile: {
    type: String,
    required: true,
    unique: false,
  },
  address: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("UserDetails", UserDetails);
