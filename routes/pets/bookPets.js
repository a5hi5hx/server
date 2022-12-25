const express = require("express");
const Booking = require("../../models/book.model");

const router = express.Router();
router.route("/enterdetails").post(async (req, res) => {
  console.log("inside booking");

  // Validate request body
  if (!req.body.name || !req.body.phone || !req.body.date || !req.body.time) {
    return res.status(400).json({ msg: "Missing required fields" });
  }
  //after validated fields
  const bookDetails = new Booking({
    name: req.body.name,
    phone: req.body.phone,
    mobile: req.body.mobile,
    address: req.body.address,
    date: req.body.date,
    time: req.body.time,
    //pid: req.body.id,
  });
  //await bookDetails.save();
  await bookDetails.save((err, result) => {
    if (err) {
      return res.status(500).json({ msg: "err booking" });
    } else {
      console.log("booking Data entry success", result);
      res.status(200).json("OK");
    }
  });
});

module.exports = router;
