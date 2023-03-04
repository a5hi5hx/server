const express = require("express");
const Booking = require("../../models/book.model");
const Pets = require("../../models/pets.model");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/myBooking", async (req, res) => {
  try {
    const booking = await Booking.findById(req.query.id).populate("user pet");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/myPetsBooked", async (req, res) => {
  const userId = req.params.userid;
  try {
    // Find all pets owned by the user
    const pets = await Pets.find({ uid: userId });
    const pid = pets["_id"];
    // Get all bookings for the user's pets
    const bookings = await Booking.find({ pet: { $in: pets } }).populate(
      "user pet"
    );

    if (bookings.length > 0) {
      res.json(bookings);
    } else {
      res.status(404).json({ message: "No bookings found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
