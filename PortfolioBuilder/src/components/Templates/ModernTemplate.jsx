import React from 'react';
import '../../styles/templates.css';

const ModernTemplate = ({ profile, projects }) => {
  return (
    <div className="modern-template">
      <header className="modern-header">
        <div className="header-content">
          {profile.photoURL && (
            <img src={profile.photoURL} alt={profile.name} className="profile-pic" />
          )}
          <h1>{profile.name || 'Your Name'}</h1>
          <p className="subtitle">{profile.bio || 'Your bio goes here'}</p>
          
          <div className="contact-links">
            {profile.email && (
              <a href={`mailto:${profile.email}`}>Email</a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone}`}>Phone</a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            )}
          </div>
        </div>
      </header>

      {profile.skills && profile.skills.length > 0 && (
        <section className="skills-section">
          <h2>Skills</h2>
          <div className="skills-grid">
            {profile.skills.map(skill => (
              <div key={skill} className="skill-item">{skill}</div>
            ))}
          </div>
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="projects-section">
          <h2>Projects</h2>
          <div className="projects-showcase">
            {projects.map(project => (
              <div key={project.id} className="project-showcase-card">
                {project.images && project.images.length > 0 && (
                  <img src={project.images[0]} alt={project.title} />
                )}
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  {project.technologies && (
                    <div className="tech-list">
                      {project.technologies.split(',').map(tech => (
                        <span key={tech.trim()}>{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="project-links">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        View Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;