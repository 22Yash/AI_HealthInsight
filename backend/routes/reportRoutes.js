require('dotenv').config();

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const axios = require('axios');

const router = express.Router();

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'), 
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);

    try {
        console.log("Reading file:", filePath);

        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer); // Extract text from PDF

        console.log("Extracted Text:", pdfData.text);

        const HF_API_KEY = process.env.HF_API_KEY;

        console.log(HF_API_KEY);
        

        if (!HF_API_KEY) {
            throw new Error("Hugging Face API key is missing. Check .env file.");
        }

        // Send text to BioGPT for medical analysis
        const bioGptResponse = await axios.post(
            "https://api-inference.huggingface.co/models/microsoft/BioGPT",
            { inputs: pdfData.text.substring(0, 500) }, // Send first 500 characters
            {
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("BioGPT Response:", bioGptResponse.data);

        res.json({
            message: "File uploaded successfully",
            filename: req.file.filename,
            text: pdfData.text,
            aiAnalysis: bioGptResponse.data // AI-generated medical insights
        });

    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ message: "Error processing PDF", error: error.message });
    }
});

module.exports = router;
