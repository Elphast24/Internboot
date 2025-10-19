const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const existingApplication = await Application.findOne({
      jobId,
      seekerId: req.userId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const application = new Application({
      jobId,
      seekerId: req.userId,
      employerId: job.employerId,
      resume,
      coverLetter,
    });

    await application.save();
    job.applicationsCount += 1;
    await job.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.userId })
      .populate('jobId')
      .populate('employerId', 'name company');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('seekerId', 'name email phone')
      .populate('jobId');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.employerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();
    res.status(200).json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};