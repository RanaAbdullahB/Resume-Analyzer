const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
      default: '',
    },

    // ── AI Analysis Results ─────────────────────────────────────────────────

    // 1. ATS Compatibility Score (0–100)
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // 2. Matching Skills
    matchingSkills: {
      type: [String],
      default: [],
    },

    // 3. Missing Keywords
    missingKeywords: {
      type: [String],
      default: [],
    },

    // 4. Suggested Improvements
    suggestions: {
      type: [String],
      default: [],
    },

    // 5. Resume Strengths
    strengths: {
      type: [String],
      default: [],
    },

    // 6. Resume Weaknesses
    weaknesses: {
      type: [String],
      default: [],
    },

    // 7. Recommended Technical Skills
    recommendedTechnicalSkills: {
      type: [String],
      default: [],
    },

    // 8. Recommended Soft Skills
    recommendedSoftSkills: {
      type: [String],
      default: [],
    },

    // 9. Interview Preparation Tips
    interviewTips: {
      type: [String],
      default: [],
    },

    // 10. Overall Hiring Readiness Summary
    hiringReadinessSummary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ──────────────────────────────────────────────────────────────
analysisSchema.virtual('scoreLabel').get(function () {
  if (this.atsScore >= 80) return 'Excellent';
  if (this.atsScore >= 60) return 'Good';
  if (this.atsScore >= 40) return 'Fair';
  return 'Needs Work';
});

analysisSchema.virtual('skillMatchPercentage').get(function () {
  const total = this.matchingSkills.length + this.missingKeywords.length;
  if (total === 0) return 0;
  return Math.round((this.matchingSkills.length / total) * 100);
});

// ─── Indexes ──────────────────────────────────────────────────────────────
analysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);