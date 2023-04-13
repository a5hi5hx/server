const express = require("express");

const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const Pet = require("../../models/pets.model");
const dotenv = require("dotenv");
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const appId = process.env.one_signal_appID;
const apiKey = process.env.one_signal_ApiKey;
const pushNotificationService = require("../../services/push-notification.services");
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.route("/addP").post(upload.single("image"), async (req, res) => {
  const {
    uid,
    nickname,
    category,
    breed,
    gender,
    health,
    age,
    weight,
    color,
    location,
  } = req.body;

  var image = req.file;

  const bookedFlag = "false";
  const stars = 0;
  //const gender = "male";

  if (
    !uid ||
    !nickname ||
    !category ||
    !gender ||
    !breed ||
    !age ||
    !weight ||
    !health ||
    !color ||
    !location
  ) {
    res.status(400).json({ msg: "All fields are required" });
  }
  if (!image) {
    res.status(400).json({ msg: "image is required" });
  }

  try {
    const pes = await cloudinary.v2.uploader
      .upload_stream({ resource_type: "image" }, (err, pes) => {
        if (pes) {
          const newP = new Pet({
            uid,
            nickname,
            category,
            breed,
            age,
            weight,
            health,
            color,
            location,
            image: pes.url,
            bookedFlag,
            stars,
            gender,
          });

          newP
            .save()
            .then((newP) => {
              const ari = sendAddNotification();
              res.status(201).json({ msg: "Pet added successfully" });
            })
            .catch((err) => {
              res.status(500).json({
                msg: "Error Saving Pet",
              });
            });
        } else {
          res.status(500).json({ msg: "Error Uploading Image" });
        }
      })
      .end(image.buffer);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});
function sendAddNotification() {
  var message = {
    app_id: appId,
    contents: { en: "New Pet Added. Tap to adopt!!" },
    included_segments: ["All"],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "AdoptMe-Rehome a Pet",
    },
  };

  pushNotificationService.sendNotification(message, (error, results) => {
    if (error) {
      return next(error);
    }
    console.log(results);
    // return res.status(200).send({
    //   message: "success",
    //   data: results,
    // });
  });
}

module.exports = router;
