const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get Authorization header (Bearer token)
  const authHeader = req.headers.authorization;

  // Check if token is provided
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract token from Bearer token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded data (user id + role) to request
    req.user = decoded;

    next(); // Continue to next middleware/controller

  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({ message: "Invalid token" });
  }
};