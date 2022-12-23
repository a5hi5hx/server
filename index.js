const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Port = process.env.port || 5000;
const app = express();
mongoose.set("strictQuery", true);
<<<<<<< HEAD
mongoose
  .connect(process.env.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
=======
const pass = "Ydd9r1C02Z2CnOCB";
mongoose
  .connect(
    "mongodb+srv://adoptmeUser:Ydd9r1C02Z2CnOCB@cluster0.inki3s6.mongodb.net/AdoptMe?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
>>>>>>> 51c056c4588140f1685b7e18fb0d6701d730bafc
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb connected");
});
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
app.route("/").get((req, res) => res.json("hello World"));

app.listen(5000, () => console.log("app started on", Port));
