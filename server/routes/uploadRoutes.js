const express = require("express");
const router = express.Router();

// import
const { uploadImages, uploadMultipleImages } = require("../controllers/uploadController");

// Middleware
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", upload.single("image"), uploadImages);
router.post("/upload-all", upload.array("image", 10), uploadMultipleImages);

module.exports = router;
