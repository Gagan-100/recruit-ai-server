const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

// Ai skill extraction utility
const { extractSkills } = require("../ai/skillExtractor");

// Pdf parser
const pdfParse = require("pdf-parse");

// Docx parser
const mammoth = require("mammoth");

// Required for streaming buffer to Cloudinary
const streamifier = require("streamifier");

// helper function to upload buffer to cloudinary
// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         folder: "recruit-ai-resumes",
//         public_id: req.file.originalname,
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "recruit-ai-resumes",
        public_id: Date.now() + "-" + originalName,
        format: originalName.split(".").pop(), // ✅ VERY IMPORTANT
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

exports.uploadResume = async (req, res) => {
  try {
    // check file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let extractedText = "";
    let extractedSkills = [];

    const fileBuffer = req.file.buffer; // ✅ use buffer instead of path
    const fileType = req.file.mimetype;

    try {
      // PDF
      if (fileType === "application/pdf") {
        const pdfData = await pdfParse(fileBuffer);
        extractedText = pdfData.text || "";
      }

      // DOCX
      else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = result.value || "";
      }

      // extract skills
      extractedSkills = extractSkills(extractedText);
    } catch (parseError) {
      console.error("Text extraction failed:", parseError.message);
    }

    // upload to cloudinary using buffer
    // const result = await uploadToCloudinary(fileBuffer);

    const result = await uploadToCloudinary(fileBuffer, req.file.originalname);

    // update user
    await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: result.secure_url,
        resumeText: extractedText,
        skills: extractedSkills,
      },
      { returnDocument: "after" },
    );

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
