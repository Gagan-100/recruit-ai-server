const Job = require("../models/Job");

// Create job
// Only recruiters can create jobs
exports.createJob = async (req, res) => {
  try {
    // Role-based access control (RBAC)
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const { title, description, skillsRequired, experience, location, salary } = req.body;

    // Create new job with recruiterId (owner)
    const job = new Job({
      title,
      description,
      skillsRequired,
      experience,
      location,
      salary,
      recruiterId: req.user.id
    });

    await job.save();

    res.status(201).json({ message: "Job posted successfully", job });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all jobs
// Used by candidates to browse jobs
exports.getAllJobs = async (req, res) => {
  try {
    // replace the recruiterId with actual recruiter data (name + email)
    const jobs = await Job.find().populate("recruiterId", "name email");

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get my jobs
// Used by recruiter to view their own posted jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update job
// Only recruiter who created the job can update it
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    // Check if job exists
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Role check (only recruiter allowed)
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can update jobs" });
    }

    // Ownership check (only creator can update)
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update job and return updated document
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      req.body,
      { new: true }
    );

    res.json({
      message: "Job updated successfully",
      updatedJob
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete job
// Only recruiter who created the job can delete it
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    // Check if job exists
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Role check (only recruiter allowed)
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can delete jobs" });
    }

    // Ownership check (only creator can delete)
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete job
    await Job.findByIdAndDelete(jobId);

    res.json({ message: "Job deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};