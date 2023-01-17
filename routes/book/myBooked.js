const express = require("express");
const router = express.Router();
const Booking = require("../../models/book.model");

router.get("/booked-pets", async (req, res) => {
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
    const bookings = await Booking.find({ uid: { uid } });

    // Return the array of booked pets
    return bookings;
  } catch (error) {
    console.error(error);
  }
}
module.exports = router;

// router.post("/findbookedpets", async (req, res) => {
//   try {
//       const { userId } = req.body;
//       const bookedPets = await Pet.find({ user: userId, booked: true });
//       res.json({ bookedPets });
//   } catch (err) {
//       res.status(500).json({ message: "Error finding booked pets", error: err });
//   }
// });
