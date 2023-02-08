const express = require("express");
const router = express.Router();
const Booking = require("../../models/book.model");

router.get("/mybookings", async (req, res) => {
  const userId = req.user._id;
  try {
    const bookings = await Booking.find({ user: userId });
    const pets = await Promise.all(
      bookings.map(async (booking) => {
        return await Pet.findById(booking.pet);
      })
    );
    res.json({ bookings, pets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
