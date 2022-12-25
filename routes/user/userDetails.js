const express = require("express");
const UserDetails = require("../../models/user.detail.model");

const router = express.Router();
router.route("/details").post((req, res) => {
  console.log("inside user details add");

  // Validate request body
  if (
    !req.body.name ||
    !req.body.phone ||
    !req.body.mobile ||
    !req.body.address ||
    !req.body.email
  ) {
    return res.status(400).json({ msg: "Missing required fields" });
  }
  //after validated fields
  const details = new UserDetails({
    name: req.body.name,
    phone: req.body.phone,
    mobile: req.body.mobile,
    address: req.body.address,
    email: req.body.email,
  });

  // details.save((err) => {
  //   if (err) return res.status(500).json({ msg: "err userdetailadd" });

  //   console.log("user Data entry success");
  //   res.status(200).json("OK");
  // });
  details.save((err) => {
    if (err) {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({
            msg: "Invalid field(s): " + Object.keys(err.errors).join(", "),
          });
      } else {
        return res.status(500).json({ msg: "Error saving user details" });
      }
    }

    console.log("user Data entry success");
    res.status(200).json("OK");
  });
});

module.exports = router;
