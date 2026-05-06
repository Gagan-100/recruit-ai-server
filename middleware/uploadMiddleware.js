const multer = require("multer");
const path = require("path");

// Storage Config 
// Defines where and how files are stored locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in uploads folder
  },
  filename: function (req, file, cb) {
    // Generate unique filename using timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

//  File filter 
// Restrict file types (only resume formats allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only PDF/DOC/DOCX allowed"), false); // Reject file
  }
};

// Initialize multer with storage and filter configuration
const upload = multer({ storage, fileFilter });

// Export middleware to use in routes
module.exports = upload;