import React from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import '../../styles/projects.css';

const ProjectsList = ({ projects, onAdd, onEdit, onDelete }) => {
  const handleDelete = (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      onDelete(project.id);
    }
  };

  return (
    <div className="projects-section">
      <div className="section-header">
        <h1>My Projects</h1>
        <button onClick={onAdd} className="btn-primary">
          <Plus size={20} /> Add Project
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              {project.images && project.images.length > 0 && (
                <img 
                  src={project.images[0]} 
                  alt={project.title} 
                  className="project-image" 
                />
              )}
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                {project.technologies && (
                  <div className="tech-tags">
                    {project.technologies.split(',').map(tech => (
                      <span key={tech.trim()} className="tech-tag">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="project-actions">
                  <button 
                    onClick={() => onEdit(project)} 
                    className="btn-icon"
                    title="Edit project"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project)} 
                    className="btn-icon danger"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Briefcase size={64} />
          <h3>No projects yet</h3>
          <p>Start building your portfolio by adding your first project</p>
          <button onClick={onAdd} className="btn-primary">
            <Plus size={20} /> Add Your First Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;