const mongoose = require("mongoose");

// Job Schema 
// Stores job details posted by recruiters
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Job title is mandatory
  },
  description: {
    type: String,
    required: true // Job description is mandatory
  },

  // List of required skills for the job
  skillsRequired: [String],

  // Experience required
  experience: String,

  // Job location
  location: String,

  // Salary details
  salary: String,

  // Reference to recruiter who created the job
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // Timestamp when job was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export Job model
module.exports = mongoose.model("Job", jobSchema);