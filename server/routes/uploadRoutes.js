const express = require("express");
const router = express.Router();

// import
const { uploadImages } = require("../controllers/uploadController");

// Middleware
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", upload.single("image"), uploadImages);

module.exports = router;
