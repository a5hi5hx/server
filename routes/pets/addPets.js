const express = require("express");
const petsModel = require("../../models/pets.model");

const Pets = require("../../models/pets.model");

const router = express.Router();

//add pets
router.route("/add").post((req, res) => {
  console.log("inside register");

  // Validate request body
  if (
    !req.body.nickname ||
    !req.body.breed ||
    !req.body.age ||
    !req.body.weight ||
    !req.body.color ||
    !req.body.location
  ) {
    return res.status(400).json({ msg: "Missing required fields" });
  }
  //after validated fields
  const pet = new Pets({
    nickname: req.body.nickname,
    breed: req.body.breed,
    age: req.body.age,
    weight: req.body.weight,
    color: req.body.color,
    location: req.body.location,
  });

  pet.save((err) => {
    if (err) {
      return res.status(500).json({ msg: "err" });
    }
    console.log("Data entry success");
    res.status(200).json("OK");
  });
});

module.exports = router;
