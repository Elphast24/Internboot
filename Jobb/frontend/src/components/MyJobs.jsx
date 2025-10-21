import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import '../styles/myjobs.css';

const MyJobs = ({ user }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/jobs');
      return;
    }
    fetchMyJobs();
  }, [user]);

  const fetchMyJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await jobsAPI.getMyJobs();
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(jobId);
        setJobs(jobs.filter((job) => job._id !== jobId));
        alert('Job deleted successfully!');
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  if (loading) return <div className="loading">Loading your jobs...</div>;

  return (
    <div className="my-jobs-container">
      <div className="my-jobs-header">
        <h1 className="my-jobs-title">My Job Listings</h1>
        <a href="/post-job" className="post-new-job-btn">
          + Post New Job
        </a>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {jobs.length === 0 ? (
        <div className="no-jobs-message">
          You haven't posted any jobs yet.{' '}
          <a href="/post-job" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Post your first job
          </a>
        </div>
      ) : (
        <div className="my-jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="my-job-card">
              <h3 className="my-job-title">{job.title}</h3>

              <div className="my-job-meta">
                <span className="my-job-meta-item">📍 {job.location}</span>
                <span className="my-job-meta-item">💼 {job.jobType}</span>
              </div>

              <div className="my-job-applications">
                👥 {job.applicationsCount} Application
                {job.applicationsCount !== 1 ? 's' : ''}
              </div>

              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                {job.description.substring(0, 100)}...
              </p>

              <div className="my-job-actions">
                <button
                  className="view-applicants-btn"
                  onClick={() => navigate(`/employer-dashboard?jobId=${job._id}`)}
                >
                  View Applicants
                </button>
                <button className="edit-btn" onClick={() => navigate(`/post-job/${job._id}`)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;