import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import '../styles/postjob.css';

const PostJob = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    salary: '',
    jobType: 'full-time',
    skills: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'employer') {
    return (
      <div className="post-job-container">
        <p className="error">Only employers can post jobs</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()),
      };

      await jobsAPI.postJob(dataToSend);
      alert('Job posted successfully!');
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <h2 className="post-job-title">Post a New Job</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div className="form-group">
          <label>Job Type *</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., $50,000 - $70,000"
          />
        </div>

        <div className="form-group">
          <label>Required Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;