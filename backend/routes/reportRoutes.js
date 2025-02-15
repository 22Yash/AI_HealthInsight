const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { analyzeTextWithGeminiWithRetry } = require("../geminiAPI");
const { io } = require('../index');  // Import Socket.IO instance

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");  // Use path.join
    fs.mkdirSync(uploadDir, { recursive: true });  // Ensure the directory exists
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }); // Use configured storage

// Helper function to convert a file to text (replace with your actual conversion logic)
async function convertFileToText(filePath) {
  try {
    // REPLACE THIS WITH YOUR ACTUAL FILE-TO-TEXT CONVERSION LOGIC (pdf-parse, OCR, etc.)
    // This is just a placeholder!
    const text = fs.readFileSync(filePath, 'utf8');
    return text;

  } catch (error) {
    console.error("Error converting file to text:", error);
    throw new Error("Failed to convert file to text."); // Re-throw for route handling
  }
}

// Route to upload report and analyze it
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedFile = req.file; // Access the uploaded file information
    const filePath = uploadedFile.path; // Get the path to the uploaded file

    console.log(`File uploaded: ${uploadedFile.originalname} to ${filePath}`); // Log file info

    // 1. Convert the uploaded file to text
    const fileText = await convertFileToText(filePath); //  Use your conversion function

    // 2. Analyze the text with Gemini
    const aiResponseText = await  analyzeTextWithGeminiWithRetry(fileText);

    // 3. Emit the AI response to the frontend via Socket.IO
    io.emit('ai_analysis_result', {  // Use a consistent event name
      filename: uploadedFile.originalname, // Send the original filename
      aiResponse: aiResponseText,
    });

    // 4. Send a success response to the frontend
    res.json({ success: true, filename: uploadedFile.originalname }); // Just confirm the upload.

  } catch (error) {
    console.error("Error uploading/analyzing report:", error);
    res.status(500).json({ error: error.message }); // Send a meaningful error message
  }
});

module.exports = router;