import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../utils/api';
import '../styles/employerdashboard.css';

const EmployerDashboard = ({ user }) => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [jobApplications, setJobApplications] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('jobId') || null);

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      window.location.href = '/jobs';
      return;
    }
    fetchEmployerData();
  }, [user]);

  const fetchEmployerData = async () => {
    setLoading(true);
    setError('');

    try {
      const jobsResponse = await jobsAPI.getMyJobs();
      setJobs(jobsResponse.data);

      // Fetch applications for each job
      const applicationsMap = {};
      for (const job of jobsResponse.data) {
        const appResponse = await applicationsAPI.getJobApplications(job._id);
        applicationsMap[job._id] = appResponse.data;
      }
      setJobApplications(applicationsMap);

      if (searchParams.get('jobId')) {
        setSelectedJobId(searchParams.get('jobId'));
      }
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, {
        status: newStatus,
      });

      // Update local state
      const updatedApplications = { ...jobApplications };
      for (const jobId in updatedApplications) {
        updatedApplications[jobId] = updatedApplications[jobId].map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        );
      }
      setJobApplications(updatedApplications);
      alert(`Application ${newStatus}!`);
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;

  return (
    <div className="employer-dashboard-container">
      <h1 className="dashboard-title">Manage Applications</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {jobs.length === 0 ? (
        <div className="no-applications-message">
          No jobs posted yet. Start by posting a job to receive applications.
        </div>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="job-applications-section">
            <div className="job-section-title">
              {job.title} ({jobApplications[job._id]?.length || 0} applications)
            </div>

            {!jobApplications[job._id] || jobApplications[job._id].length === 0 ? (
              <div className="no-applications-message">
                No applications for this job yet.
              </div>
            ) : (
              <div className="applicants-grid">
                {jobApplications[job._id].map((app) => (
                  <div
                    key={app._id}
                    className={`applicant-card ${
                      app.status === 'accepted'
                        ? 'accepted'
                        : app.status === 'rejected'
                        ? 'rejected'
                        : ''
                    }`}
                  >
                    <div className="applicant-name">{app.seekerId?.name}</div>

                    <div className="application-status-badge" style={{
                      backgroundColor:
                        app.status === 'pending' ? '#fff3cd' :
                        app.status === 'reviewed' ? '#cfe2ff' :
                        app.status === 'shortlisted' ? '#d1e7dd' :
                        app.status === 'accepted' ? '#d1e7dd' :
                        '#f8d7da',
                      color:
                        app.status === 'pending' ? '#856404' :
                        app.status === 'reviewed' ? '#084298' :
                        app.status === 'shortlisted' ? '#0f5132' :
                        app.status === 'accepted' ? '#0f5132' :
                        '#842029',
                    }}>
                      {app.status}
                    </div>

                    <div className="applicant-contact">
                      <div className="applicant-contact-item">
                        <span>📧</span>
                        {app.seekerId?.email}
                      </div>
                      {app.seekerId?.phone && (
                        <div className="applicant-contact-item">
                          <span>📱</span>
                          {app.seekerId?.phone}
                        </div>
                      )}
                    </div>

                    {app.coverLetter && (
                      <div className="job-applied">
                        <div className="job-applied-title">Cover Letter:</div>
                        {app.coverLetter.substring(0, 100)}...
                      </div>
                    )}

                    <div className="applicant-actions">
                      <button
                        className="applicant-actions action-btn-shortlist"
                        onClick={() =>
                          handleStatusChange(app._id, 'shortlisted')
                        }
                      >
                        ⭐ Shortlist
                      </button>
                      <button
                        className="applicant-actions action-btn-accept"
                        onClick={() =>
                          handleStatusChange(app._id, 'accepted')
                        }
                      >
                        ✓ Accept
                      </button>
                      <button
                        className="applicant-actions action-btn-reject"
                        onClick={() =>
                          handleStatusChange(app._id, 'rejected')
                        }
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EmployerDashboard;