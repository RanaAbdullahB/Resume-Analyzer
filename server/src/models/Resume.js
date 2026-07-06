const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true, // Stored filename on disk (e.g. resume-1234567890.pdf)
    },
    originalName: {
      type: String,
      required: true, // User's original filename (e.g. John_Doe_Resume.pdf)
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true,
    },
    fileSize: {
      type: Number,
      required: true, // Size in bytes
    },
    extractedText: {
      type: String,
      required: true,
      // Full text extracted from the resume document
    },
    wordCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────
resumeSchema.virtual('fileSizeFormatted').get(function () {
  const kb = this.fileSize / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
});

// ─── Hooks ────────────────────────────────────────────────────────────────────
resumeSchema.pre('save', function (next) {
  if (this.isModified('extractedText')) {
    this.wordCount = this.extractedText
      .split(/\s+/)
      .filter(Boolean).length;
  }
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);