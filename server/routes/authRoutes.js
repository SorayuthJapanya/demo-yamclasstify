const express = require("express");

// import
const {
  signup,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");
const { protectRoute } = require("../middleware/authMiddleware");

// middleware

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// middleware check
router.get("/me", protectRoute, getCurrentUser);

module.exports = router;
