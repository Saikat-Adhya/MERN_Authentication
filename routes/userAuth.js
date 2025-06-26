const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getDashboard,
  getEditUser,
  postEditUser,
  deleteUser,
  logoutUser,
} = require("../controller/autController");
const { requireAuth } = require("../middleware/authMiddleware");

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// protected
router.get("/dashboard", requireAuth, getDashboard);
router.get("/edit/:id", requireAuth, getEditUser);
router.post("/edit/:id", requireAuth, postEditUser);
router.post("/delete/:id", requireAuth, deleteUser);

// logout (clears the cookie)
router.get("/logout", logoutUser);

module.exports = router;
