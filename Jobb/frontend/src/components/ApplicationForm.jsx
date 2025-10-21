import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../utils/api';
import '../styles/applicationform.css';

const ApplicationForm = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    resume: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'job_seeker') {
      <Navigate to='/jobs'/>
      return;
    }
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsAPI.getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await applicationsAPI.applyJob({
        jobId: id,
        resume: resumeFile ? resumeFile.name : formData.resume,
        coverLetter: formData.coverLetter,
      });
      alert('Application submitted successfully!');
      navigate('/my-applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div className="loading">Loading job details...</div>;

  return (
    <div className="application-form-container">
      <h2 className="application-form-title">Apply for Job</h2>
      <p className="application-form-subtitle">
        Complete your application below
      </p>

      {job && (
        <div className="job-preview">
          <div className="job-preview-title">{job.title}</div>
          <div className="job-preview-company">{job.employerId?.name}</div>
          <div className="job-preview-details">
            📍 {job.location} • 💼 {job.jobType}
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>Upload Resume (PDF)</label>
          <label className="file-input-label">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <div>📄 Click to upload or drag and drop</div>
            {resumeFile && (
              <div className="file-name">
                Selected: {resumeFile.name}
              </div>
            )}
          </label>
        </div>

        <div className="form-section">
          <label>Cover Letter *</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Tell us why you're interested in this position and what makes you a good fit..."
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(`/jobs/${id}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;