const express = require("express");
const router = express.Router();
const Pets = require("../../models/pets.model");
const Booking = require("../../models/book.model");
const dotenv = require("dotenv");
dotenv.config();
const appId = process.env.one_signal_appID;
const apiKey = process.env.one_signal_ApiKey;
const pushNotificationService = require("../../services/push-notification.services");

router.post("/removePet", async (req, res) => {
  try {
    const pet = await Pets.findById(req.body.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
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
    const ari = sendSuccessNotification();

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
function sendSuccessNotification() {
  var message = {
    app_id: appId,
    contents: {
      en: "Cheers.. A pet has been succesfully rehomed. Its your turn to Rehome a pet now",
    },
    included_segments: ["All"],
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
    console.log(results);
  });
}
module.exports = router;
