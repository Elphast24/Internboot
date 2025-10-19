const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: String, // URL or file path
    coverLetter: String,
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);