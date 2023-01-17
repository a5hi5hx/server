const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/users.model");

const router = express.Router();

//register user
router.route("/register").post((req, res) => {
  console.log("inside register");

  // Validate request body
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // Check if user with same username or email already exists
  User.findOne(
    { $or: [{ username: req.body.username }, { email: req.body.email }] },
    (err, existingUser) => {
      if (err) {
        return res.status(500).json({ msg: err });
      }
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "Username or email already exists" });
      }

      // Hash password
      const saltRounds = 10;
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ msg: err });
        }

        // Create new user
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
        });

        // Save user to database
        user.save((err) => {
          if (err) {
            return res.status(500).json({ msg: err });
          }
          console.log("registered success");
          res.status(200).json("OK");
        });
      });
    }
  );
});

//login controller
router.route("/login").post((req, res) => {
  console.log("inside login");

  // Validate request body
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // Find user with matching username
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    if (!user) {
      return res.status(404).json({ msg: "Username not found" });
    }

    // Compare hashed passwords
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ msg: err });
      }
      if (!isMatch) {
        return res.status(401).json({ msg: "Incorrect password" });
      }

      console.log("passwords match");

      // Generate JWT
      // const payload = {
      //   id: User._id,
      //   username: User.username,
      // };
      // const options = {
      //   expiresIn: "1d",
      // };
      // jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
      //   if (err) {
      //     return res.status(500).json({ msg: err });
      //   }
      res.status(200).json({ userId: user._id });
      console.log("login success");
    });
  });
});

module.exports = router;
