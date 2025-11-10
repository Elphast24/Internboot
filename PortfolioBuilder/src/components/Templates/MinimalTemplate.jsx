import React from 'react';
import '../../styles/templates.css';

const MinimalTemplate = ({ profile, projects }) => {
  return (
    <div className="minimal-template">
      <div className="minimal-container">
        <header className="minimal-header">
          {profile.photoURL && (
            <img src={profile.photoURL} alt={profile.name} className="minimal-profile-pic" />
          )}
          <h1>{profile.name || 'Your Name'}</h1>
          <p>{profile.bio || 'Your bio goes here'}</p>

          <nav className="minimal-nav">
            {profile.email && (
              <a href={`mailto:${profile.email}`}>Email</a>
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
          </nav>
        </header>

        {profile.skills && profile.skills.length > 0 && (
          <section className="minimal-section">
            <h2>Skills</h2>
            <p className="minimal-skills">{profile.skills.join(' • ')}</p>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section className="minimal-section">
            <h2>Projects</h2>
            {projects.map(project => (
              <div key={project.id} className="minimal-project">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Visit →
                  </a>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;