require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");

// Import route modules
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// Import database connection
const connectDB = require("./db.js");

const app = express();

//  Database connection
// Connect to MongoDB before starting server
connectDB();

//  Middleware 
app.use(cors());           // Enable cross-origin requests- Allows frontend and backend to talk to each other
app.use(express.json());   // Parse JSON request body- Converts incoming JSON data into a JavaScript object

// Routes
// Mount all API routes with base paths
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);

// Root route for testing server
app.get("/", (req, res) => {
  res.send("Recruit-AI Backend Running");
});

const PORT = process.env.PORT || 5000;

// Start server
// Start server after DB connection setup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});