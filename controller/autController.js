const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// helper
const createToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

// -------- REGISTER ----------
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    // set cookie & hop straight to dashboard
    const token = createToken(user);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/api/auth/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration error");
  }
};

// -------- LOGIN -------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send("Invalid password");

    const token = createToken(user);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/api/auth/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
};

// -------- DASHBOARD ----------
const getDashboard = async (req, res) => {
  try {
    const users = await User.find();
    res.render("dashboard", {
      users,
      current: req.user.email,
      namei: req.user.name,
    });
  } catch (err) {
    res.status(500).send("Dashboard error");
  }
};

// -------- EDIT USER ----------
const getEditUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("edit", { user });
};

const postEditUser = async (req, res) => {
  const { name, email } = req.body;
  await User.findByIdAndUpdate(req.params.id, { name, email });
  res.redirect("/api/auth/dashboard");
};

// -------- DELETE USER --------
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/api/auth/dashboard");
};

// -------- LOGOUT -------------
const logoutUser = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
};

module.exports = {
  registerUser,
  loginUser,
  getDashboard,
  getEditUser,
  postEditUser,
  deleteUser,
  logoutUser,
};
