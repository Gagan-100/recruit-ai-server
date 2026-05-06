const multer = require("multer");
const path = require("path");

// use memory instead of local disk (important for deployment)
const storage = multer.memoryStorage();

// File filter (same as before)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC/DOCX allowed"), false);
  }
};

// Initialize multer
const upload = multer({ storage, fileFilter });

module.exports = upload;