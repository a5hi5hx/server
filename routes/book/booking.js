const express = require("express");
const Pet = require("../../models/pets.model");

const Booking = require("../../models/book.model");

const router = express.Router();
router.post("/book-pets", async (req, res) => {
  try {
    // Get the uid, pid, time, and date from the request body
    const { uid, pid, time, date } = req.body;

    // Find the pet with the specified pid
    const pet = await Pet.findOne({ pid });

    // Create a new booking with the uid, time, and date
    const booking = new Booking({
      uid,
      pid: pet.pid,
      time,
      date,
    });

    // Save the booking to the Bookings collection
    await booking.save();

    // Delete the pet from the Pets collection
    await Pet.deleteOne({ pid });

    res.send(booking);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
