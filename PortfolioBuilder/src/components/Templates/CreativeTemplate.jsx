import React from 'react';
import '../../styles/templates.css';

const CreativeTemplate = ({ profile, projects }) => {
  return (
    <div className="creative-template">
      <div className="creative-sidebar">
        {profile.photoURL && (
          <img src={profile.photoURL} alt={profile.name} className="creative-profile-pic" />
        )}
        <h1>{profile.name || 'Your Name'}</h1>
        <p className="creative-bio">{profile.bio || 'Your bio'}</p>

        <div className="creative-contact">
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
        </div>

        {profile.skills && profile.skills.length > 0 && (
          <div className="creative-skills">
            <h3>Skills</h3>
            {profile.skills.map(skill => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        )}
      </div>

      <div className="creative-main">
        <h2>Featured Projects</h2>
        <div className="creative-projects">
          {projects && projects.map(project => (
            <div key={project.id} className="creative-project-card">
              {project.images && project.images.length > 0 && (
                <div className="creative-project-image">
                  <img src={project.images[0]} alt={project.title} />
                </div>
              )}
              <div className="creative-project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                {project.technologies && (
                  <div className="creative-tech">
                    {project.technologies.split(',').map(tech => (
                      <span key={tech.trim()}>{tech.trim()}</span>
                    ))}
                  </div>
                )}
                
                <div className="creative-project-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;