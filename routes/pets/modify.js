const express = require("express");
const { castObject } = require("../../models/pets.model");
//const { isObjectIdOrHexString } = require("mongoose");
const ObjectID = require("mongodb").ObjectId;

const Pets = require("../../models/pets.model");

const router = express.Router();

router.route("/modify").post(async (req, res) => {
  console.log("inside modify");
  //const id = isObjectIdOrHexString(req.body.id);
  //if (!id) {
  //const oid = new ObjectID(req.body.id);

  // const pet = await Pets.findOne({ id: req.body.id });
  // if (!pet) {
  //   return res.status(400).json({ message: "Not Found" });
  // } else {
  //   // res.json(pet);
  //   pet.updateOne(
  //     { _id: req.body.id },
  //     {
  //       $set: {
  //         nickname: req.body.name,
  //         age: req.body.age,
  //         weight: req.body.weight,
  //         color: req.body.color,
  //         location: req.body.location,
  //         breed: req.body.breed,
  //       },
  //     },
  //     (err, result) => {
  //       if (err) {
  //         throw err;
  //       } else {
  //         console.log("Pet updated", result);
  //         res.json(result);
  //       }
  //     }
  //   );
  // }
  //} else {
  // const pet = await Pets.findOne({ _id: req.body.id });
  // if (!pet) {
  //   return res.status(400).json({ message: "Not Found oid" });
  // } else {
  //   Pets.updateOne(
  //     { _id: req.body.id },
  //     {
  //       $set: {
  //         name: req.body.name,
  //         age: req.body.age,
  //         weight: req.body.weight,
  //         color: req.body.color,
  //         location: req.body.location,
  //         breed: req.body.location,
  //       },
  //     },
  //     (err, result) => {
  //       if (err) {
  //         throw err;
  //       } else {
  //         console.log("Pet updated", result);
  //         res.json(result);
  //       }
  //     }
  //   );
  // }
  //}

  // collection.updateOne(
  //   { _id: oid },
  //   {
  //     $set: {
  //       name: req.body.name,
  //       age: req.body.age,
  //       weight: req.body.weight,
  //       color: req.body.color,
  //       location: req.body.location,
  //       breed: req.body.location,
  //     },
  //   },
  //   function (err, result) {
  //     console.log("Pet updated");
  //   }
  // );
  var filter = castObject;
  // const update = {
  //   nickname: req.body.name,
  //   breed: req.body.breed,
  //   age: req.body.age,
  //   weight: req.body.weight,
  //   color: req.body.color,
  //   location: req.body.location,
  // };
  // await Pets.countDocuments(filter);
  // let up=await Pets.findByIdAndUpdate
  Pets.findByIdAndUpdate(
    { filter },
    {
      nickname: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      weight: req.body.weight,
      color: req.body.color,
      location: req.body.location,
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = router;
