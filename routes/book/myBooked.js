const express = require("express");
const router = express.Router();
const Booking = require("../../models/book.model");

router.get("/mybookings", async (req, res) => {
  try {
    // Get the uid from the request query
    const uid = req.body.uid;

    // Find the booked pets
    const bookedPets = await findBookedPets(uid);

    res.send(bookedPets);
  } catch (error) {
    console.error(error);
  }
});
async function findBookedPets(uid) {
  try {
    // Find all bookings in the Bookings collection where the uid is not the given uid
    const bookings = await Booking.find({ userID: { uid } });

    res.json(bookings);
  } catch (error) {
    res.json({ msg: error.message });
    console.error(error);
  }
}
module.exports = router;
