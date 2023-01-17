// const express = require("express");
// const Pet = require("../../models/pets.model");

// const Booking = require("../../models/book.model");

// const router = express.Router();
// router.post("/book-pets", async (req, res) => {
//   try {
//     // Get the uid, pid, time, and date from the request body
//     const { uid, pid, time, date } = req.body;

//     // Find the pet with the specified pid
//     const pet = await Pet.findOne({ pid });

//     // Create a new booking with the uid, time, and date
//     const booking = new Booking({
//       uid,
//       pid: pet.pid,
//       time,
//       date,
//     });

//     // Save the booking to the Bookings collection
//     await booking.save();

//     // Delete the pet from the Pets collection
//     await Pet.deleteOne({ pid });

//     res.send(booking);
//   } catch (error) {
//     console.error(error);
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Booking = require("../../models/book.model");
const UserDetails = require("../../models/user.detail.model");
const Pets = require("../../models/pets.model");

router.post("/book", async (req, res) => {
  try {
    // simple validation
    if (
      !req.body.userId ||
      !req.body.petId ||
      !req.body.date ||
      !req.body.time
    ) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }

    // check if user and pet exists
    const user = await UserDetails.findById(req.body.userId);
    if (!user) {
      return res.status(400).json({ msg: "Invalid user id" });
    }
    const pet = await Pets.findById(req.body.petId);
    if (!pet) {
      return res.status(400).json({ msg: "Invalid pet id" });
    }

    // create booking
    const newBooking = new Booking({
      user: req.body.userId,
      pet: req.body.petId,
      date: req.body.date,
      time: req.body.time,
    });
    await newBooking.save();

    // flag pet as booked
    pet.booked = true;
    await pet.save();

    return res.json({ msg: "Booking successful" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
