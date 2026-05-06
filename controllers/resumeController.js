const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/User");

// Ai skill extraction utility
const { extractSkills } = require("../ai/skillExtractor");

// Pdf parser for extracting text
const pdfParse = require("pdf-parse");

// Docx parser support
const mammoth = require("mammoth");

exports.uploadResume = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let extractedText = "";   // Stores resume text
    let extractedSkills = []; // Stores extracted skills

    // Get uploaded file details
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    try {
      // Text Extraction
      // Handle Pdf files
      if (fileType === "application/pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text || "";
      }

      // Handle DOCX files
      else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value || "";
      }

      // Extract skills from resume text
      extractedSkills = extractSkills(extractedText);

    } catch (parseError) {
      console.error("Text extraction failed:", parseError.message);
    }

    //  Cloud upload
    // Upload resume file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "recruit-ai-resumes",
    });

    //  Database update 
    // Save resume URL + extracted data in user profile
    await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: result.secure_url,
        resumeText: extractedText,
        skills: extractedSkills,
      },
      {
        returnDocument: "after",
      }
    );

    // Remove file from local storage after upload
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Resume uploaded successfully",
      resume: result.secure_url,
      skills: extractedSkills,
    });

    } catch (error) {
      console.error("Resume upload error:", error.message);

      res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
};