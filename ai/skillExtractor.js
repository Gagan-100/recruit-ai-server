const skillsList = [
  "react", "node", "node.js", "mongodb", "express",
  "javascript", "python", "java", "c++",
  "html", "css", "sql", "aws", "docker",
  "kubernetes", "typescript", "next.js", "redux"
];

// Function to extract relevant skills from given text (e.g., resume)
// Uses simple keyword matching approach
exports.extractSkills = (text) => {
  // Handle empty or undefined input
  if (!text) return [];

  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();

  // Filter predefined skills that are present in the text
  return skillsList.filter(skill =>
    lowerText.includes(skill)
  );
};