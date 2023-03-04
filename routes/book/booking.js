const express = require("express");
const Booking = require("../../models/book.model");
const Pets = require("../../models/pets.model");
const UserDetails = require("../../models/user.detail.model");
const router = express.Router();

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
        const changestatus = await Pets.findByIdAndUpdate(
          { _id: petID },
          { $set: { bookedFlag: "false" } }
        );
        res.status(400).json({ msg: "Booking Unsuccessful" });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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
  const userId = req.query.userid;
  try {
    console.log(userId);

    // Find all pets owned by the user
    const pets = await Pets.find({ uid: userId, bookedFlag: "true" });
    console.log(pets);
    // const pid = pets["_id"];
    const pid = pets[0]._id;
    console.log(pid);

    // Get all bookings for the user's pets
    const bookings = await Booking.find({ pet: pid }).populate("user pet");
    console.log(bookings);
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
router.get("/mypetsBooked", async (req, res) => {
  const userId = req.query.userid;
  try {
    // Find all pets owned by the user
    const pets = await Pets.find({ uid: userId, bookedFlag: "true" });
    console.log(pets);

    const bookings = [];

    // Loop through each pet and get its bookings
    for (const pet of pets) {
      const pid = pet._id;
      console.log(pid);

      // Get all bookings for the pet
      const petBookings = await Booking.find({ pet: pid }).populate("user pet");
      console.log(petBookings);

      // Add the pet's bookings to the overall list of bookings
      bookings.push(...petBookings);
    }

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

router.delete("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    const pets = await Pet.findById(booking.pet._id);

    pets.bookedFlag = false;
    await pets.save();

    await Booking.findByIdAndDelete(req.params.bookingId);

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    pet.bookedFlag = true;
    await pet.save();
    res.status(500).json({ message: "Booking deletion failed" });
  }
});

module.exports = router;
