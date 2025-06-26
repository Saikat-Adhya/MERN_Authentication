const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const path = require("path");
const connectDB = require("./config/dbConfig");
const userAuth = require("./routes/userAuth");
const cookieParser = require("cookie-parser");
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // This is where your index.ejs should be
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

// app.get("/dashboard", getDashboard);
app.use("/api/auth", userAuth); // Use the userAuth routes under /api/auth
app.listen(PORT, () => {
  connectDB(); // Connect to MongoDB
  console.log(`Server is running on port ${PORT}`);
});
