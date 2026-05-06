const mongoose = require("mongoose");

// Application Schema
// Stores data when a user applies for a job
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Reference to Job collection
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User collection
    required: true
  },
  resume: {
    type: String // Cloudinary URL of uploaded resume
  },

  // Stores matched skills between user and job
  matchedSkills: {
    type: [String],
    default: []
  },

  // AI-based score used for ranking applicants
  score: {
    type: Number,
    default: 0
  },

  // Application status tracking
  status: {
    type: String,
    enum: ["applied", "reviewed", "accepted", "rejected"],
    default: "applied"
  },

  // Timestamp when application was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export Application model
module.exports = mongoose.model("Application", applicationSchema);