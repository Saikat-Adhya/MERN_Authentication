const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // optional: make user info available
    next();
  } catch (err) {
    res.clearCookie("jwt");
    return res.redirect("/login");
  }
};

module.exports = { requireAuth };
