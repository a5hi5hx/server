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
const userRoute = require("./routes/user/user");
app.use("/user", userRoute);
const authRoute = require("./routes/user/auth");
app.use("/auth", authRoute);

const authUserRoute = require("./routes/user/auth");
app.use("/authuser", authUserRoute);
const petRoute = require("./routes/pets/addPets");
app.use("/data", petRoute);
const viewRoute = require("./routes/pets/returnAll");
app.use("/returnpets", viewRoute);
const modifyRoute = require("./routes/pets/modify");
app.use("/edit", modifyRoute);
// const bookRoute = require("./routes/book/bookPets");
// app.use("/book", bookRoute);
const bookShowRoute = require("./routes/book/returnBookDetails");
app.use("/bookings", bookShowRoute);
const bookReturnRoute = require("./routes/book/returnBookDetails");
app.use("/returnall", bookReturnRoute);
const userdetail = require("./routes/user/userDetails");
app.use("/user", userdetail);
const addpetsdetail = require("./routes/pets/img");
app.use("/addpets", addpetsdetail);
app.route("/").get((req, res) => res.json("hello World"));

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
