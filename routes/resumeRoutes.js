const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadResume } = require("../controllers/resumeController");

// Upload resume
// Protected route for uploading resume
// Flow: auth → multer upload → controller logic
router.post(
  "/upload",
  authMiddleware,            // Ensure user is logged in
  upload.single("resume"),   // Handle single file upload 
  uploadResume               // Process file (parse, upload to cloud, save in DB)
);

module.exports = router;