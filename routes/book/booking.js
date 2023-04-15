const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const appId = process.env.one_signal_appID;
const apiKey = process.env.one_signal_ApiKey;
const pushNotificationService = require("../../services/push-notification.services");
const Booking = require("../../models/book.model");
const Pets = require("../../models/pets.model");
const UserDetails = require("../../models/user.detail.model");
const router = express.Router();

router.post("/bookPets", async (req, res) => {
  try {
    const { userID, petID, date, time } = req.body;

    const pet = await Pets.findById(petID);
    console.log(pet);
    if (!pet) {
      return res.status(400).json({ msg: "Pet not found" });
    }
    const playerId = pet.playerId;
    if (pet.bookedFlag == "true") {
      return res.status(400).json({ msg: "Already Booked" });
    } else {
      const peti = await Pets.findByIdAndUpdate(
        { _id: petID },
        { $set: { bookedFlag: "true" } }
      );
      // const pet = await Pets.findById({ _id: petID });
      // pet.bookedFlag = true;
      if (peti) {
        const newBooking = new Booking({
          user: userID,
          pet: petID,
          date: date,
          time: time,
        });
        if (newBooking.save()) {
          const ari = sendBookNotification(playerId);
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
    console.log(e);
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
function sendBookNotification(playerId) {
  var message = {
    app_id: appId,
    contents: { en: "Your pet has been booked. View the booking now." },
    //included_segments: ["included_palyer_ids"],
    include_player_ids: [playerId],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "AdoptMe-Rehome a Pet",
    },
  };

  pushNotificationService.sendNotification(message, (error, results) => {
    if (error) {
      return next(error);
    }
  });
}
// router.get("/myPetsBooked", async (req, res) => {
//   const userId = req.query.userid;
//   try {
//     console.log(userId);

//     // Find all pets owned by the user
//     const pets = await Pets.find({ uid: userId, bookedFlag: "true" });
//     console.log(pets);
//     // const pid = pets["_id"];
//     const pid = pets[0]._id;
//     console.log(pid);

//     // Get all bookings for the user's pets
//     const bookings = await Booking.find({ pet: pid }).populate("user pet");
//     console.log(bookings);
//     if (bookings.length > 0) {
//       res.json(bookings);
//     } else {
//       res.status(404).json({ message: "No bookings found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
router.get("/mypetsBooked", async (req, res) => {
  const userId = req.query.userid;
  try {
    // Find all pets owned by the user
    const pets = await Pets.find({ uid: userId, bookedFlag: "true" });

    const bookings = [];

    // Loop through each pet and get its bookings
    for (const pet of pets) {
      const pid = pet._id;

      // Get all bookings for the pet
      const petBookings = await Booking.find({ pet: pid }).populate("user pet");

      // Add the pet's bookings to the overall list of bookings
      bookings.push(...petBookings);
    }

    if (bookings.length > 0) {
      bookings.reverse();
      res.json(bookings);
    } else {
      res.status(404).json({ message: "No bookings found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", err });
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

// router.get("/bookings/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const bookings = await Booking.find({ user: userId })
//       .populate("user")
//       .populate("pet")
//       .exec();

//     res.status(200).json(bookings);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });
router.get("/myBookings/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ user: userId })
      .populate("user", "-__v")
      .populate("pet", "-__v")
      .select("-__v")
      .exec();
    bookings.reverse();
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
