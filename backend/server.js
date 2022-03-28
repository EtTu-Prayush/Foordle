const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8000;
const DB_NAME = "tutorial";

// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var BuyerRouter = require("./routes/buyer");
var loginRouter = require("./routes/login");
var VendorRouter = require("./routes/vendor");
var FoodRouter = require("./routes/food");
var OrderRouter = require("./routes/order");
var ShopRouter = require("./routes/shops");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(
  "mongodb+srv://karman:karman1232@cluster0.ogq3d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/buyer", BuyerRouter);
app.use("/login", loginRouter);
app.use("/vendor", VendorRouter);
app.use("/food", FoodRouter);
app.use("/order", OrderRouter);
app.use("/shops", ShopRouter);
app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
