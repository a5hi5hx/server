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
