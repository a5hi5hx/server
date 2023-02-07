const express = require("express");
const Booking = require("../../models/book.model");
const Pets = require("../../models/pets.model");
const userDetailModel = require("../../models/user.detail.model");

const router = express.Router();

router.get("/myBooked", async (req, res) => {
  try {
    const { userID } = req.body;

    const pet = await Pets.find({ uid: userID });
    if (pet.bookedFlag == true) {
      res.json(pet);
    }
    // Find all bookings in the Bookings collection
    const bookings = await Booking.find({});

    res.send(bookings);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
