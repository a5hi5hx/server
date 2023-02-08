const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../../models/book.model");
const Pet = require("../../models/pets.model");

router.delete("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    const pet = await Pet.findById(booking.pet._id);

    pet.bookedFlag = false;
    await pet.save();

    await Booking.findByIdAndDelete(req.params.bookingId);

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    pet.bookedFlag = true;
    await pet.save();
    res.status(500).json({ message: "Booking deletion failed" });
  }
});

module.exports = router;
