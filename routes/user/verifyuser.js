const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/users.model");
const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

//const User = require("../../models/users.model");
// const usersModel = require("../../models/users.model");
// const OAuth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );
// OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
router.route("/verifyUser").post(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User Not Found" });
  }
  const secret = process.env.JWT_SECRET + user.email;
  const payload = {
    email: user.email,
    id: user._id,
  };
  const token = jwt.sign(payload, secret);
  const link = `https://talented-slug-sun-hat.cyclic.app/verify/verifyUser/${user._id}/${token}`;
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
      var mailOptions = {
        from: "AdoptMe Nepal <adoptmenepal@gmail.com>",
        to: email,
        subject: "Email Verification Link",

        text: `Please click on the link to verify your account ${link}.do check your spam folder.Cheers...`,
        html: `<h2>Please click on the link to verify your account ${link} </h2><p> do check your spam folder <p> Cheers... `,
      };
      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.warn(err);
          return res.status(401).json({ msg: "Error sending link" });
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
      console.log(error);
    }

    // return res
    //   .status(201)
    //   .json({ msg: "Reset Link sent to email. Check Mail." });
  } catch (err) {
    return res.status(401).json({ msg: `Error occured${err.message}` });
  }
});
router.route("/verifyUserr/:id/:token").get(async (req, res, next) => {
  const { id, token } = req.params;
  //check if this id exists in database
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ msg: "Invalid ID" });
  }
  //valid Id with valid user
  const secret = process.env.JWT_SECRET + user.email;
  try {
    const payload = jwt.verify(token, secret);
    console.log(payload);
    await User.updateOne({ _id: id }, { isVerified: "true" });
    res.render("verified", { email: user.email });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});
module.exports = router;
