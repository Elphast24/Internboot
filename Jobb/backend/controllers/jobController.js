const Job = require('../models/Job');

exports.getAllJobs = async (req, res) => {
  try {
    const { title, location, category } = req.query;
    const filter = { isActive: true };

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (category) filter.category = category;

    const jobs = await Job.find(filter).populate('employerId', 'name company');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postJob = async (req, res) => {
  try {
    const { title, description, location, category, salary, jobType, skills } = req.body;

    const job = new Job({
      title,
      description,
      location,
      category,
      salary,
      jobType,
      skills,
      employerId: req.userId,
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.userId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};