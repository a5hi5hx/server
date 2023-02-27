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

router.get("/pets/:category", async (req, res) => {
  try {
    const pets = await Pets.find({ category: req.params.category });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
