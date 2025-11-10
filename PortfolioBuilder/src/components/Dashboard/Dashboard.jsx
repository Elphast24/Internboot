import React from 'react';
import { User, Plus, Eye, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';

const Dashboard = ({ projects, setActiveTab, onAddProject, onPreview }) => {
  const { profile, user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome back, {profile?.name || user?.email}!</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{projects.length}</h3>
          <p>Projects</p>
        </div>
        <div className="stat-card">
          <h3>{profile?.skills?.length || 0}</h3>
          <p>Skills</p>
        </div>
        <div className="stat-card">
          <h3>{profile?.name ? 'Complete' : 'Incomplete'}</h3>
          <p>Profile</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => setActiveTab('profile')} className="action-btn">
            <User size={24} />
            <span>Edit Profile</span>
          </button>
          <button onClick={onAddProject} className="action-btn">
            <Plus size={24} />
            <span>Add Project</span>
          </button>
          <button onClick={onPreview} className="action-btn">
            <Eye size={24} />
            <span>Preview Portfolio</span>
          </button>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="recent-projects">
          <h2>Recent Projects</h2>
          <div className="project-list">
            {projects.slice(0, 3).map(project => (
              <div key={project.id} className="project-item">
                {project.images && project.images.length > 0 && (
                  <img src={project.images[0]} alt={project.title} />
                )}
                <div className="project-item-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;