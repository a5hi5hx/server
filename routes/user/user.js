const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/users.model");
const { check } = require("express-validator");

const router = express.Router();

// router.route("/update").patch(async (req, res) => {
//   try {
//     const result = await User.findOneAndUpdate(
//       { username: req.body.username },
//       { $set: { password: req.body.password } }
//     );
//     res.json({ message: "Password updated", username: req.params.username });
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });
router.route("/update").patch(async (req, res) => {
  try {
    // Validate the request body
    // const { error } = updatePasswordValidation(req.body);
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    // // Check if the user is authenticated
    // if (!req.user) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    // Verify the user by their username and old password
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }
    //const hashedoldPassword = await bcrypt.hash(req.body.password, 10);
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    //console.log(hashedoldPassword);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    // Encrypt the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Update the passwordgit push
    const result = await User.findOneAndUpdate(
      { username: req.body.username }, // Only allow the authenticated user to update their own password
      { $set: { password: hashedPassword } }
    );
    res.json({ message: "Password updated", username: req.body.username });
  } catch (error) {
    // Log the error and send a generic message to the client
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

function updatePasswordValidation(data) {
  return check(data, {
    username: check("username").exists().withMessage("Username is required"),
    oldPassword: check("oldPassword")
      .exists()
      .withMessage("Old password is required"),
    password: check("password")
      .exists()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  });
}

router.route("/deleteuser").delete(async (req, res) => {
  try {
    const username = req.body.username;
    const result = await User.findOneAndDelete({ username: username });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted", username: username });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.route("/showusers").get((req, res) => {
  // Use find() to retrieve all documents
  User.find((error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: "Error retrieving users" });
    } else {
      res.send(result);
    }
  });
});
router.route("/:username").get((req, res) => {
  User.findOne({ username: req.params.username }, (err, result) => {
    if (err) res.status(500).json({ msg: err });
    res.json({
      data: result,
      username: req.params.username,
    });
  });
});
module.exports = router;
