const express = require("express");

// import
const {
  signup,
  login,
  logout,
  getCurrentUser,
  getAllClient,
  getAllUsers,
  getAllAdmins,
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

router.post("/signup", signup); // ENDPOINT: http://localhost:5001/api/v1/auth/signup
router.post("/login", login); // ENDPOINT: http://localhost:5001/api/v1/auth/login
router.post("/logout", logout); // ENDPOINT: http://localhost:5001/api/v1/auth/logout

// CRUD API
router.get("/allclient", protectRoute, adminOnly, getAllClient); // ENDPOINT: http://localhost:5001/api/v1/auth/allclient
router.get("/allusers", protectRoute, adminOnly, getAllUsers); // ENDPOINT: http://localhost:5001/api/v1/auth/allusers
router.get("/alladmins", protectRoute, adminOnly, getAllAdmins); // ENDPOINT: http://localhost:5001/api/v1/auth/alladmins
router.get("/get-user/:_id", protectRoute, adminOnly, getUser); // ENDPOINT: http://localhost:5001/api/v1/auth/get-user/:_id
router.put("/update-user/:_id", protectRoute, adminOnly, updateUser); // ENDPOINT: http://localhost:5001/api/v1/auth/update-user/:_id
router.delete("/delete-user/:_id", protectRoute, adminOnly, deleteUser); // ENDPOINT: http://localhost:5001/api/v1/auth/delete-user/:_id

// middleware check
router.get("/me", protectRoute, getCurrentUser); //ENDPOINT:  http://localhost:5001/api/v1/auth/me

module.exports = router;
