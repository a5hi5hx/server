const express = require("express");
const Booking = require("../../models/book.model");

const router = express.Router();
router.route("/book").post(async (req, res) => {
  console.log("inside booking");

  //validate request body
  if (!req.body.uid || !req.body.pid) {
    return res.status(400).json({ msg: "Missing required fields" });
  }
  const bookP = new Booking({
    uid: req.body.uid,
    pid: req.body.pid,
    time: req.body.time,
    date: req.body.date,
  });
  await bookP.save((err, result) => {
    if (err) {
      return res.status(500).json({ msg: "err booking" });
    } else {
      console.log("booking Data entry success", result);
      res.status(200).json("OK");
    }
  });
});

module.exports = router;
