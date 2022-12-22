const express = require("express");
const mongoose = require("mongoose");
const Port = process.env.port || 5000;

const app = express();
mongoose.set("strictQuery", true);

mongoose
  .connect(
    "mongodb+srv://adoptmeUser:Ydd9r1C02Z2CnOCB@cluster0.inki3s6.mongodb.net/AdoptMe?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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
app.route("/").get((req, res) => res.json("hello World"));

app.listen(5000, () => console.log("app started on", Port));
