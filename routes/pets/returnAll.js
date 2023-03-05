const express = require("express");
const Pets = require("../../models/pets.model");

const router = express.Router();

router.route("/viewall").get((req, res) => {
  console.log("inside viewall");

  Pets.find({ bookedFlag: "false" }, (err, result) => {
    if (err) {
      throw err;
    } else {
      result.reverse();
      res.json(result);
    }
  });
});

router.post("/pets", async (req, res) => {
  try {
    const category = req.body.category;
    const pets = await Pets.find({ category: category, bookedFlag: "false" });
    pets.reverse();
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

router.route("/myPets/:uid").get((req, res) => {
  const { uid } = req.params;
  Pets.find({ uid: uid }, (err, result) => {
    if (err) {
      res.json({ msg: "Empty" });
      throw err;
    } else {
      res.json(result);
    }
  });
});
module.exports = router;
