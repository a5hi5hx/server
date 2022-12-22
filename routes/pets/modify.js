const express = require("express");
const petsModel = require("../../models/pets.model");

const Pets = require("../../models/pets.model");

const router = express.Router();

router.route("/edit").post((req, res) => {
  console.log("inside modify");
});

module.exports = router;
