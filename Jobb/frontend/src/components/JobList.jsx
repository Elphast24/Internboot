import React, { useEffect, useState } from 'react';
import { jobsAPI, applicationsAPI } from '../utils/api';
import {LocateFixed, DollarSign, BriefcaseBusiness} from 'lucide-react'
import '../styles/jobs.css';

const JobList = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    category: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await jobsAPI.getAllJobs(filters);
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobDetail = (jobId) => {
    // Navigate to job detail page
    window.location.href = `/jobs/${jobId}`;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    if (!user) {
      alert('Please login to apply');
      return;
    }

    try {
      await applicationsAPI.applyJob({
        jobId,
        resume: 'Resume URL',
        coverLetter: 'Cover Letter',
      });
      alert('Applied successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="jobs-container">
      <h1 className="jobs-title">Find Your Dream Job</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="no-jobs">No jobs found</div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.employerId?.name}</p>

              <div className="job-details">
                <span className="job-detail-item"><LocateFixed/> {job.location}</span>
                <span className="job-detail-item"><BriefcaseBusiness/> {job.jobType}</span>
                {job.salary && (
                  <span className="job-detail-item"><DollarSign/> {job.salary}</span>
                )}
              </div>
              <p className="job-description">{job.description}</p>

              <div className="job-actions">
                {user && user.role === 'job_seeker' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApply(job._id)}
                  >
                    Apply Now
                  </button>
                )}
                {(!user || user.role === 'employer' || user.role === 'job_seeker') && (
                  <button className="btn btn-primary"
                    onClick={() => handleJobDetail(job._id)}>
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;