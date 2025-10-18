import React, { useEffect, useState } from 'react';
import { applicationsAPI } from '../utils/api';
import '../styles/jobs.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;

  return (
    <div className="jobs-container">
      <h1 className="jobs-title">My Applications</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {applications.length === 0 ? (
        <div className="no-jobs">No applications yet</div>
      ) : (
        <div className="jobs-grid">
          {applications.map((app) => (
            <div key={app._id} className="job-card">
              <h3 className="job-title">{app.jobId?.title}</h3>
              <p className="job-company">{app.employerId?.name}</p>

              <div className="job-details">
                <span className="job-detail-item">
                  📍 {app.jobId?.location}
                </span>
                <span className="job-detail-item">
                  Status:{' '}
                  <strong
                    style={{
                      color:
                        app.status === 'accepted'
                          ? 'green'
                          : app.status === 'rejected'
                          ? 'red'
                          : 'orange',
                    }}
                  >
                    {app.status}
                  </strong>
                </span>
              </div>

              <p className="job-description">{app.jobId?.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;