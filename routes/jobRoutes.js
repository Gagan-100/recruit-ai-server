const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { 
  createJob, 
  getAllJobs, 
  getMyJobs, 
  updateJob, 
  deleteJob 
} = require("../controllers/jobController");


// Create job 
// Recruiter posts a new job (protected route)
router.post("/", authMiddleware, createJob);

//  Get all jobs 
// Public route for candidates to view all jobs
router.get("/", getAllJobs);

//  Get my jobs
// Recruiter fetches their own posted jobs
router.get("/my-jobs", authMiddleware, getMyJobs);

//  Update job
// Only recruiter (owner) can update a job
router.patch("/:id", authMiddleware, updateJob);

// Delete job 
// Only recruiter (owner) can delete a job
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;