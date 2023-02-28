const express = require("express");
const Pets = require("../../models/pets.model");

const router = express.Router();

router.route("/viewall").get((req, res) => {
  console.log("inside viewall");

  Pets.find({ bookedFlag: "false" }, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  });
});

router.post("/pets", async (req, res) => {
  try {
    const category = req.body.category;
    const pets = await Pets.find({ category: category, bookedFlag: "false" });
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/pets/increase-stars", async (req, res) => {
  try {
    const pet = await Pets.findById(req.body.id);
    pet.stars++;
    await pet.save();
    res.json(pet.stars);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
