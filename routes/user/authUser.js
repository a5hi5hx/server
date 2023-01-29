const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const User = require("../../models/users.model");

const authrouter = express.Router();
//const PORT = process.env.PORT || 5000;
const router = express.Router();

//const app = express();

//signup route
router.route("/signup").post(async (req, res) => {
  console.log("inside register");

  try {
    console.log("inside register");

    const { id, username, email, token, password } = req.body;

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

router.route("/signin").post(async (req, res) => {
  try {
    const { id, username, email, password } = req.body;
    console.log("inside register");

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this username doesnt exists." });
    }
    console.log("inside register");

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password Incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    return res.status(200).json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.route("/tokenValid").get(async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) {
      return res.json(false);
    }
    const user = await User.findById(verified.id);
    if (!verified) {
      return res.json(false);
    }
    return res.json(true);
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
