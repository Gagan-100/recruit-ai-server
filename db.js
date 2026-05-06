const mongoose = require("mongoose");

// Database Connection 
// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Forces IPv4 (helps avoid connection issues in some networks)
    });

    console.log("MongoDB Connected"); // Success log

  } catch (error) {
    console.error("MongoDB Connection Failed", error); // Error log
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;