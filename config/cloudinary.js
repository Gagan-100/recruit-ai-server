require("dotenv").config(); // Load environment variables from .env file

const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with credentials from environment variables
// This keeps sensitive data secure and out of source code
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // API key for authentication
  api_secret: process.env.CLOUDINARY_API_SECRET  // API secret for secure access
});

// Export configured Cloudinary instance for use in other files
module.exports = cloudinary;