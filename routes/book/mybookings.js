const express = require("express");
const Booking = require("../../models/book.model");
const Pets = require("../../models/pets.model");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/mybookings", async (req, res) => {
  const userId = req.query.userId;

  try {
    const bookings = await Booking.find({ user: userId })
      .populate("user")
      .populate("pet");

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/mypetsbookings", async (req, res) => {
  const userId = req.body.userId;

  try {
    const pets = await Pets.find({ uid: userId });
    const petIds = pets.map((pet) => pet._id);

    const bookings = await Booking.find({ pet: { $in: petIds } })
      .populate("user")
      .populate("pet");

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
