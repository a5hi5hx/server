const express = require("express");
const Pets = require("../../models/pets.model");

const router = express.Router();

router.route("/viewall").get((req, res) => {
  console.log("inside viewall");
  //await Pets.find({});
  //   Pets.find({}).toArray(function (err, result) {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.send(JSON.stringify(result));
  //     }
  //   });

  Pets.find({}, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
