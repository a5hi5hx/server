const express = require("express");
const Pets = require("../../models/pets.model");

const router = express.Router();

router.route("/viewall").get((req, res) => {
  console.log("inside viewall");

  Pets.find({}, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
