const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const uri =
  "mongodb+srv://adoptmeUser:Ydd9r1C02Z2CnOCB@cluster0.inki3s6.mongodb.net/AdoptMe?retryWrites=true&w=majority";
//const uri = process.env.url;
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

const authUserRoute = require("./routes/user/authUser");
app.use("/authuser", authUserRoute);
const viewRoute = require("./routes/pets/returnAll");
app.use("/returnpets", viewRoute);

app.route("/").get((req, res) => res.json("You are connected to Server."));
const bookRoute = require("./routes/book/booking");
app.use("/book", bookRoute);
const mybookings = require("./routes/book/mybookings");
app.use("/list", mybookings);
// app.listen(5000, () => console.log("app started on", Port));
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

// "scripts": {
//   "test": "echo \"Error: no test specified\" && exit 1",
//   "start": "node index",
//   "dev": "nodemon index"
// },
