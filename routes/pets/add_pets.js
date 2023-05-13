const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const Pet = require("../../models/pets.model");
const dotenv = require("dotenv");
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const mongoose = require("mongoose");
const notificationser = require("../../controllers/push-notification.controller");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.route("/addP").post(upload.single("image"), async (req, res) => {
  const { uid, nickname, breed, age, weight, health, color, location } =
    req.body;

  const image = req.file;
  const bookedFlag = false;
  // Simple validation
  if (
    !uid ||
    !nickname ||
    !breed ||
    !age ||
    !weight ||
    !health ||
    !color ||
    !location
  ) {
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
            health,
            color,
            location,
            image: result.url,
            bookedFlag: "false",
          });
          newPet
            .save()
            .then((pet) => {
              notificationser.SendAddNotification;
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
// Add pet route
router.route("/add").post(upload.single("image"), async (req, res) => {
  const { uid, nickname, breed, age, weight, health, color, location } =
    req.body;
  const image = req.file;
  const bookedFlag = false;
  // Simple validation
  if (
    !uid ||
    !nickname ||
    !breed ||
    !age ||
    !weight ||
    !health ||
    !color ||
    !location
  ) {
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
            health,
            color,
            location,
            image: result.url,
            bookedFlag: "false",
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
