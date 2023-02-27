// // const express = require("express");
// // const UserDetails = require("../../models/user.detail.model");

// // const router = express.Router();
// // router.route("/details").post((req, res) => {
// //   console.log("inside user details add");

// //   // Validate request body
// //   if (
// //     !req.body.name ||
// //     !req.body.phone ||
// //     !req.body.mobile ||
// //     !req.body.address ||
// //     !req.body.email
// //   ) {
// //     return res.status(400).json({ msg: "Missing required fields" });
// //   }
// //   //after validated fields
// //   const details = new UserDetails({
// //     name: req.body.name,
// //     phone: req.body.phone,
// //     mobile: req.body.mobile,
// //     address: req.body.address,
// //     email: req.body.email,
// //   });

// //   // details.save((err) => {
// //   //   if (err) return res.status(500).json({ msg: "err userdetailadd" });

// //   //   console.log("user Data entry success");
// //   //   res.status(200).json("OK");
// //   // });
// //   details.save((err) => {
// //     if (err) {
// //       if (err.name === "ValidationError") {
// //         return res
// //           .status(400)
// //           .json({
// //             msg: "Invalid field(s): " + Object.keys(err.errors).join(", "),
// //           });
// //       } else {
// //         return res.status(500).json({ msg: "Error saving user details" });
// //       }
// //     }

// //     console.log("user Data entry success");
// //     res.status(200).json("OK");
// //   });
// // });

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const UserDetails = require("../../models/user.detail.model");
// const User = require("../../models/users.model");

// router.post("/addDetails", async (req, res) => {
//   const { uid, name, phone, mobile, address, email } = req.body;
//   if (!uid || !name || !phone || !mobile || !address || !email) {
//     return res.status(400).json({ msg: "All fields are Required" });
//   }
//   try {
//     const userDetails = new UserDetails({
//       _id: uid,
//       name: name,
//       phone: phone,
//       mobile: mobile,
//       address: address,
//       email: email,
//     });
//     const result = await userDetails.save();
//     res.status(201).json({
//       msg: "User created successfully!",
//       _id: result._id,
//       name: result.name,
//       phone: result.phone,
//       mobile: result.mobile,
//       address: result.address,
//       email: result.email,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // router.get("/:userId", async (req, res) => {
// //   try {
// //     const user = await UserDetails.findById(req.params.userId);
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }
// //     res.status(200).json({
// //       _id: user._id,
// //       name: user.name,
// //       phone: user.phone,
// //       mobile: user.mobile,
// //       address: user.address,
// //       //email: user.email,
// //     });
// //   } catch (error) {
// //     if (error instanceof mongoose.CastError) {
// //       return res.status(400).json({ message: "Invalid user ID" });
// //     }
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // router.get("/returnuser", async (req, res) => {
// //   try {
// //     const userId = req.query.userId;
// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     const userDetails = await UserDetails.findOne({ _id: userId });
// //     // return res.status(200).json({ user, userDetails });
// //     res.status(200).json({
// //       _id: userDetails._id,
// //       username: user.username,
// //       name: userDetails.name,
// //       phone: userDetails.phone,
// //       mobile: userDetails.mobile,
// //       address: userDetails.address,
// //       email: user.email,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ message: "Internal server error" });
// //   }
// // });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

const UserDetails = require("../../models/user.detail.model");
const User = require("../../models/users.model");
// configure multer storage for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// configure cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// define API endpoint for entering user details
router.post("/enteruserdetails", upload.single("image"), async (req, res) => {
  try {
    // validate request body fields
    const { uid, name, phone, mobile, address, email } = req.body;
    if (!uid || !name || !phone || !mobile || !address || !email) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // create new UserDetails document with validated fields and uploaded image URL
    const userDetails = new UserDetails({
      _id: uid,
      image: result.secure_url,
      name,
      phone,
      mobile,
      address,
      email,
    });

    // save new UserDetails document to database
    const savedUserDetails = await userDetails.save();

    // send success response with saved UserDetails document
    res.json(savedUserDetails);
  } catch (error) {
    // handle any errors
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});
router.get("/userdetails/:id", async (req, res) => {
  try {
    // find UserDetails document with specified _id and populate referenced User document
    const userDetails = await UserDetails.findById(req.params.id).populate(
      "_id"
    );

    // send success response with UserDetails and User data
    res.json(userDetails);
  } catch (error) {
    // handle any errors
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
