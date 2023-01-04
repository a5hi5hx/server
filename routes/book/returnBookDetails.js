const express = require("express");
const Booking = require("../../models/book.model");

const router = express.Router();

router.get("/returnBookings", async (req, res) => {
  try {
    // Find all bookings in the Bookings collection
    const bookings = await Booking.find({});

    res.send(bookings);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
