const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("../../models/user.detail.model");
dotenv.config();

//router.route("/forgot-password").get(req, res, (next) => {});

router.route("/forgot-password").post(async (req, res, next) => {
  const { email } = req.body;
  //console.log(email);

  //userexists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User Not Found" });
  }
  //onetimepasswordlinkvalid for 15min
  const secret = process.env.JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    id: user._id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "10m" });
  const link = `https://talented-slug-sun-hat.cyclic.app/password/reset-password/${user._id}/${token}`;

  try {
    try {
      const transport = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "adoptmenepal@gmail.com",
          pass: "qzrhbacyrzpaaboh",
        },
      });
      const mailOptions = {
        from: "AdoptMe <adoptmenepal@gmail.com>",
        to: userEmail,
        subject: "Password Reset Request",
        text: `Your one time password reset link is ${link}. Ignore If you are not aware. Cheers...`,
        html: `<h2>Your one time password reset link is<p> ${link} <p> Ignore If you are not aware. Cheers...</h2>`,
      };

      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.warn(err);
          return res.status(400).json({ msg: "Error sending link" });
        } else {
          console.log("sent");
          return res
            .status(201)
            .json({ msg: "Reset Link sent to email. Check Mail." });
        }
      });
      // return res
      //   .status(201)
      //   .json({ msg: "Reset Link sent to email. Check Mail." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
      console.log(error);
    }

    return res
      .status(201)
      .json({ msg: "Reset Link sent to email. Check Mail." });
  } catch (err) {
    return res.status(500).json({ msg: `Error occured${err.message}` });
  }
  //return res.status(201).json({ msg: "Reset Link sent to email" });
});

router.route("/reset-password/:id/:token").get(async (req, res, next) => {
  const { id, token } = req.params;
  //check if this id exists in database
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ msg: "Invalid ID" });
  }
  //valid Id with valid user
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});
router.route("/reset-password/:id/:token").post(async (req, res, next) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ msg: "Invalid ID" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    //validate passwords
    if (password == password2) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const isChanged = await User.findByIdAndUpdate(
          { _id: id },
          { password: hashedPassword }
        );
        return res.send("User Password Updated");
      } catch (error) {
        res.send(error.message);
      }
    } else {
      return res.send("Passwords Don't Match");
    }
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

module.exports = router;
