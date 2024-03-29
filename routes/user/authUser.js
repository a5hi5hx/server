const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const User = require("../../models/users.model");
const UserDetails = require("../../models/user.detail.model");
const router = express.Router();

//signup route
router.route("/signup").post(async (req, res) => {
  try {
    const isVerified = "false";
    const { id, username, email, token, password } = req.body;

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ msg: "Username exists" });
    }
    const existingEmail = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ msg: "User Email exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new User({
      username,
      password: hashedPassword,
      email,
      isVerified,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.route("/signin").post(async (req, res) => {
  try {
    const { id, username, email, password } = req.body;

    let isDetails = "";
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this username doesnt exists." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password Incorrect" });
    }

    const details = await UserDetails.findById({ _id: user._id });
    if (!details) {
      isDetails = "no";
      return res.status(200).json({ ...user._doc, isDetails });
    }
    isDetails = "yes";
    const name = details.name;
    const address = details.address;
    const phone = details.phone;
    const mobile = details.mobile;
    const image = details.image;
    const token = jwt.sign({ id: user._id }, "passwordKey");
    return res.status(200).json({
      token,
      ...user._doc,
      isDetails,
      image,
      name,
      address,
      phone,
      mobile,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.route("/tokenValid").get(async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.json({ msg: "false" });
    }
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) {
      return res.json({ msg: "false" });
    }
    const user = await User.findById(verified.id);
    if (!verified) {
      return res.json({ msg: "false" });
    }
    return res.json({ msg: "true" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//get userdata
router.route("/user").get(auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = router;
