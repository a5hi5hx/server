const express = require("express");
const router = express.Router();
const Pets = require("../../models/pets.model");
const Booking = require("../../models/book.model");

router.post("/removePet", async (req, res) => {
  try {
    const pet = await Pets.findById(req.body.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // await Pets.deleteOne({ _id: req.body.id });
    pet.displayFlag = "false";
    await pet.save();
    res.json({ message: "Pet removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.post("/successBooking", async (req, res) => {
  try {
    const booking = await Booking.findById(req.body.bookingId);
    const pet = await Pets.findById(booking.pet._id);
    pet.bookedFlag = true;
    pet.displayFlag = false;
    await pet.save();

    await Booking.findByIdAndDelete(req.body.bookingId);
    res.json({ message: "Congrats for successful booking" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.post("/removeBooking", async (req, res) => {
  try {
    const booking = await Booking.findById(req.body.bookingId);
    const pet = await Pets.findById(booking.pet._id);
    pet.bookedFlag = false;
    pet.displayFlag = true;
    await pet.save();

    await Booking.findByIdAndDelete(req.body.bookingId);

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    const booking = await Booking.findById(req.body.bookingId);
    const pet = await Pets.findById(booking.pet._id);
    console.log(pet);
    pet.bookedFlag = true;
    await pet.save();
    res.status(500).json({ message: "Booking deletion failed" });
  }
});

module.exports = router;
