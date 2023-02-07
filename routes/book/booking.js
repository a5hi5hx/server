const express = require("express");
const Booking = require("../../models/book.model");
const Pets = require("../../models/pets.model");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/bookPets", async (req, res) => {
  try {
    const { userID, petID, date, time } = req.body;

    const pet = await Pets.find({ _id: petID });

    if (pet.bookedFlag == "true") {
      return res.status(400).json({ msg: "Already Booked" });
    } else {
      const isBooked = await Pets.findByIdAndUpdate(
        { _id: petID },
        { $set: { bookedFlag: "true" } }
      );
      if (isBooked) {
        const newBooking = new Booking({
          user: userID,
          pet: petID,
          date: date,
          time: time,
        });
        if (newBooking.save()) {
          res.json({ msg: "Booking Successful" });
        }
      } else {
        res.status(400).json({ msg: "Booking Unsuccessful" });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
