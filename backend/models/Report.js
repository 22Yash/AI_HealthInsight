const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    pdfFilename: { type: String, required: true },
    textFilename: { type: String, required: true },
    pdfPath: { type: String, required: true },
    textPath: { type: String, required: true },
    extractedText: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
