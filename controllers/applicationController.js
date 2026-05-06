const Application = require("../models/Application");

// Required models for user and job data
const User = require("../models/User");
const Job = require("../models/Job");

// Normalize skill names to avoid mismatch issues
// Example: "React.js" → "react", "NodeJS" → "node"
const normalizeSkill = (skill) => {
  return skill
    .toLowerCase()
    .replace(".js", "")
    .replace("nodejs", "node")
    .trim();
};

exports.applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const existing = await Application.findOne({ userId, jobId });

    // Get user and job
    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const userSkills = user.skills || [];
    const jobSkills = job.skillsRequired || [];

    const normalize = (s) => s.toLowerCase().trim();

    // Match skills
    const matchedSkills = jobSkills.filter((skill) =>
      userSkills.map(normalize).includes(normalize(skill)),
    );

    // Score
    const score =
      jobSkills.length > 0
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 0;

    
    // Update existing application
    if (existing) {
      existing.resume = user.resume;
      existing.matchedSkills = matchedSkills;
      existing.score = score;

      await existing.save();

      return res.status(200).json({
        message: "Application updated",
        application: existing,
      });
    }

    
    // New application
    const application = new Application({
      userId,
      jobId,
      resume: user.resume,
      matchedSkills,
      score,
    });

    await application.save();

    return res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my Application 
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch applications of logged-in user
    // Fill job details for frontend display
    const applications = await Application.find({ userId }).populate("jobId");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Applicants-Ranked wise
exports.getApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Fetch all applicants for a job
    // Fill user details (name, email, skills, resume)
    // Sort by score in descending order (highest first)
    const applications = await Application.find({ jobId })
      .populate("userId", "name email skills resume")
      .sort({ score: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
