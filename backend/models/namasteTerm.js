const mongoose = require('mongoose');

const namasteTermSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  term: {
    type: String,
    required: true,
    index: true
  },
  system: {
    type: String,
    required: true,
    enum: ['Ayurveda', 'Siddha', 'Unani']
  }
}, {
  timestamps: true
});

// Create text index for better search performance
namasteTermSchema.index({ term: 'text', code: 'text' });

module.exports = mongoose.model('NamasteTerm', namasteTermSchema);