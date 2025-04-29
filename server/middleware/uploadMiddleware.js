const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

// filter minetype (นามสกุลไฟล์)
const fileFilter = (req, file, cb) => {
  // console.log("Hello");
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".png", ".jpg", ".jpeg"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg allowed!!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB/file
  fileFilter,
});

module.exports = upload;
