const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const authUserRoute = require("./routes/user/authUser");
app.use("/authuser", authUserRoute);
const passwordLink = require("./routes/user/passwordReset");
app.use("/password", passwordLink);
const viewRoute = require("./routes/pets/returnAll");
app.use("/returnpets", viewRoute);
const uDetails = require("./routes/user/userDetails");
app.use("/user", uDetails);
const addRR = require("./routes/pets/add");
app.use("/add", addRR);
app.route("/").get((req, res) => res.json("You are connected to Server."));
const bookRoute = require("./routes/book/booking");
app.use("/book", bookRoute);
const mybookings = require("./routes/book/bookings_actions");
app.use("/list", mybookings);
const verification = require("./routes/user/verifyuser");
app.use("/verify", verification);
const notify = require("./routes/notification/notification.routes");
app.use("/notify", notify);
const removeP = require("./routes/pets/delete");
app.use("/delete", removeP);
const favourites = require("./routes/favourites/add");
app.use("/favourites", favourites);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
