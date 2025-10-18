import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../utils/api';
import {LocateFixed, NotepadTextDashedIcon, DollarSign, BriefcaseBusiness, User, Folder} from 'lucide-react'
import '../styles/jobdetail.css';

const JobDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await jobsAPI.getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      alert('Please login to apply');
      navigate('/auth?mode=login');
      return;
    }

    setApplying(true);

    try {
      await applicationsAPI.applyJob({
        jobId: id,
        resume: 'Resume URL',
        coverLetter: 'Cover Letter',
      });
      setHasApplied(true);
      alert('Applied successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading-error">Loading job details...</div>;
  if (error) return <div className="loading-error error">{error}</div>;
  if (!job) return <div className="loading-error">Job not found</div>;

  return (
    <div className="job-detail-container">
      <a className="back-link" onClick={() => navigate('/jobs')}>
        ← Back to Jobs
      </a>

      <div className="job-detail-header">
        <h1 className="job-detail-title">{job.title}</h1>
        <p className="job-detail-company">{job.employerId?.name}</p>
      </div>

      <div className="job-detail-meta">
        <div className="meta-item">
          <span className="meta-label">Location</span>
          <span className="meta-value"><LocateFixed/> {job.location}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Job Type</span>
          <span className="meta-value"><BriefcaseBusiness/> {job.jobType}</span>
        </div>

        {job.salary && (
          <div className="meta-item">
            <span className="meta-label">Salary</span>
            <span className="meta-value"><DollarSign/> {job.salary}</span>
          </div>
        )}

        <div className="meta-item">
          <span className="meta-label">Category</span>
          <span className="meta-value"><Folder/> {job.category}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Applications</span>
          <span className="meta-value"><User/> {job.applicationsCount}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Posted</span>
          <span className="meta-value"><NotepadTextDashedIcon/> {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="job-detail-section">
        <h3>About This Job</h3>
        <p style={{width: '90%'}}>{job.description}</p>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="job-detail-section">
          <h3>Required Skills</h3>
          <div className="skills-list">
            {job.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="job-detail-actions">
        {user && user.role === 'job_seeker' && (
          <button
            className="btn btn-success"
            onClick={handleApply}
            disabled={applying || hasApplied}
          >
            {hasApplied ? '✓ Applied' : applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}

        {(!user || user.role === 'employer') && (
          <button className="btn btn-primary" disabled>
            {user?.role === 'employer' ? 'Your Job' : 'Sign In to Apply'}
          </button>
        )}

        <button
          className="btn btn-primary"
          onClick={() => navigate('/jobs')}
        >
          Back to Listings
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
