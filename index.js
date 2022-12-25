const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const uri =
  "mongodb+srv://adoptmeUser:Ydd9r1C02Z2CnOCB@cluster0.inki3s6.mongodb.net/AdoptMe?retryWrites=true&w=majority";
mongoose.set("strictQuery", true);
// <<<<<<< HEAD
//const url = process.env.url;
// mongoose
//   .connect(
//     process.env.url
//     //    {
//     //   // useNewUrlParser: true,
//     //   // useUnifiedTopology: true,
//     // }
//   )
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.log(error));
// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("mongodb connected");
// });
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// =======
// mongoose
//   .connect(process.env.url
// //            {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   }
//           )
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.log(error));
// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("mongodb connected");
// });
// >>>>>>> c36b1c58e9ad6d2a8ccb2d97b09ea1b57497dfd3

//middlewares
app.use(express.json());
const userRoute = require("./routes/user/user");
app.use("/user", userRoute);
const authRoute = require("./routes/user/auth");
app.use("/auth", authRoute);
const petRoute = require("./routes/pets/addPets");
app.use("/data", petRoute);
const viewRoute = require("./routes/pets/returnAll");
app.use("/return", viewRoute);
const modifyRoute = require("./routes/pets/modify");
app.use("/edit", modifyRoute);
const bookRoute = require("./routes/pets/bookPets");
app.use("/bookings", bookRoute);
const userdetail = require("./routes/user/userDetails");
app.use("/user", userdetail);
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
