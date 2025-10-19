const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    salary: { type: String },
    jobType: { type: String, enum: ['full-time', 'part-time', 'contract'], required: true },
    skills: [String],
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicationsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);