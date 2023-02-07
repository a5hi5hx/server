const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const Pet = require("../../models/pets.model");
const dotenv = require("dotenv");
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Add pet route
router.route("/add").post(upload.single("image"), async (req, res) => {
  const { uid, nickname, breed, age, weight, color, location } = req.body;
  const image = req.file;
  const bookedFlag = false;
  // Simple validation
  if (!uid || !nickname || !breed || !age || !weight || !color || !location) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!image) {
    return res.status(400).json({ msg: "Image is required" });
  }

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (result) {
          // Save pet to MongoDB
          const newPet = new Pet({
            uid,
            nickname,
            breed,
            age,
            weight,
            color,
            location,
            image: result.url,
            bookedFlag: bookedFlag,
          });
          newPet
            .save()
            .then((pet) => {
              return res.status(201).json({ msg: "Pet added successfully" });
            })
            .catch((err) => {
              return res.status(500).json({ msg: "Error saving pet" });
            });
        } else {
          return res.status(500).json({ msg: "Error uploading image" });
        }
      })
      .end(image.buffer);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

// const express = require("express");
// const petsModel = require("../../models/pets.model");

// const Pets = require("../../models/pets.model");

// const router = express.Router();

// //add pets
// router.route("/add").post((req, res) => {
//   console.log("inside register");

//   // Validate request body
//   if (
//     !req.body.uid ||
//     !req.body.nickname ||
//     !req.body.breed ||
//     !req.body.age ||
//     !req.body.weight ||
//     !req.body.color ||
//     !req.body.location ||
//     !req.body.image
//   ) {
//     return res.status(400).json({ msg: "Missing required fields" });
//   }
//   //after validated fields
//   const pet = new Pets({
//     uid: req.body.uid,
//     nickname: req.body.nickname,
//     breed: req.body.breed,
//     age: req.body.age,
//     weight: req.body.weight,
//     color: req.body.color,
//     location: req.body.location,
//     image: req.body.image,
//   });

//   pet.save((err) => {
//     if (err) {
//       return res.status(500).json({ msg: "err" });
//     }
//     console.log("Data entry success");
//     res.status(200).json("OK");
//   });
// });

// module.exports = router;
