const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const Pet = require("../../models/pets.model");
const dotenv = require("dotenv");
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const UserDetails = require("../../models/user.detail.model");
// configure cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router
  .route("/addUserDetails")
  .post(upload.single("image"), async (req, res) => {
    const { uid, name, phone, mobile, address, email } = req.body;
    var image = req.file;
    if (!uid || !name || !phone || !mobile || !address || !email) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }
    if (!image) {
      res.status(400).json({ msg: "Image is required" });
    }
    try {
      const uidu = await cloudinary.v2.uploader
        .upload_stream({ resource_type: "image" }, (err, uiu) => {
          if (uiu) {
            const urli = uiu.url;
            const newUser = new UserDetails({
              _id: uid,
              name,
              phone,
              mobile,
              address,
              email,
              image: uiu.url,
            });
            newUser
              .save()
              .then((newUser) => {
                res.status(201).json({
                  msg: "User Details Saved Successfully.",
                  name,
                  phone,
                  mobile,
                  address,
                  email,
                  urli,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  msg: "Error Saving User Details",
                });
              });
          } else {
            res.status(500).json({ msg: "Error Uploading Image" });
          }
        })
        .end(image.buffer);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server error" + error.message });
    }
  });

router.route("/returndetails").get((req, res) => {
  UserDetails.find((err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  });
});

router.post("/details", async (req, res) => {
  try {
    const uid = req.body.uid;
    const user = UserDetails.find({ _id: uid }, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json(result);
      }
    });
    // if (user) {
    //   res.json(user);
    // } else {
    //   res.json({ msg: "Not Found" });
    // }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
