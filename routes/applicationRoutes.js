const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Import application-related controller functions
const {
  applyJob,
  getMyApplications,
  getApplicantsForJob
} = require("../controllers/applicationController");

// Apply job
// Candidate applies to a job (requires authentication)
router.post("/:jobId", authMiddleware, applyJob);

// Get my applications
// Candidate fetches their own applied jobs
router.get("/my-applications", authMiddleware, getMyApplications);

// Get applicants ranked wise 
// Recruiter views applicants for a job (sorted by AI score)
router.get("/job/:jobId", authMiddleware, getApplicantsForJob);

module.exports = router;