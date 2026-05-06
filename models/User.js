const mongoose = require("mongoose");

// User Schema 
// Stores user details for authentication + resume-based matching
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // User name is required
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate accounts
  },
  password: {
    type: String,
    required: true, // Stored as hashed password
  },

  // Role-based access control (RBAC)
  role: {
    type: String,
    enum: ["candidate", "recruiter", "admin"],
    default: "candidate",
  },

  // Account creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Resume file URL (stored in Cloudinary)
  resume: {
    type: String,
    default: null,
  },

  // Extracted text from resume (used for NLP processing)
  resumeText: {
    type: String,
    default: "",
  },

  // Extracted skills from resume (used for matching)
  skills: {
    type: [String],
    default: [],
  },
});

// Export User model
module.exports = mongoose.model("User", userSchema);