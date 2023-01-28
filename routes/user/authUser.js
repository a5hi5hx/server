const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/users.model");

const authrouter = express.Router();
const PORT = process.env.PORT || 5000;

//const app = express();

//signup route
router.route("/signup").post(async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ email, username }] });

    if (existingUser) {
      return res.status(400).json({ msg: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new User({
      username,
      password: hashedPassword,
      email,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.route("/signup").post(async (req, res) => {
  try {
    const { username, password } = req.body;

    const uuser = await User.findOne({ email, username });
    if (!uuser) {
      return res
        .status(400)
        .json({ msg: "User with this username doesnt exists." });
    }
    const isMatch = bcrypt.compare(password, uuser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password Incorrect" });
    }

    const token = jwt.sign({ id: uuser._id }, "passwordKey");
    return res.json({ token, ...uuser._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authrouter;
