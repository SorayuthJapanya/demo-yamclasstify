const express = require("express");

// import
const {
  signup,
  login,
  logout,
  getCurrentUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

// middleware
const { protectRoute } = require("../middleware/authMiddleware");

// Middleware for Admin Only
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// CRUD API
router.get("/allusers", protectRoute, adminOnly, getAllUsers);
router.get("/user", protectRoute, getUser);
router.put("/user/:_id", protectRoute, adminOnly, updateUser);
router.delete("/user/:_id", protectRoute, adminOnly, deleteUser);

// middleware check
router.get("/me", protectRoute, getCurrentUser);

module.exports = router;
