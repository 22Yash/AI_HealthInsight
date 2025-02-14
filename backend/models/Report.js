const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);
