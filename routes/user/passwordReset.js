const { response } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const User = require("../../models/users.model");
const OAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
//router.route("/forgot-password").get(req, res, (next) => {});

router.route("/forgot-password").post(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);

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
  sendMail2(email, link)
    .then(
      (result) => console.log("Email sent...", result),
      res.status(201).json({ msg: "Email sent Success. Check Mail" })
    )
    .catch(
      (error) => console.log(error.message),
      res.status(400).json({ msg: "Error in sending Link" })
    );
  return res.status(201).json({ msg: "Reset Link sent to email" });
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

async function sendMail2(userEmail, link) {
  try {
    const accessToken = await OAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "adoptmenepal@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: "AdoptMe <adoptmenepal@gmail.com>",
      to: userEmail,
      subject: "Password Reset Request",
      text: `Your one time password reset link is ${link}. Ignore If you are not aware. Cheers...`,
      html: `<h2>Your one time password reset link is<p> ${link} <p> Ignore If you are not aware. Cheers...</h2>`,
    };
    const result = await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}
module.exports = router;
