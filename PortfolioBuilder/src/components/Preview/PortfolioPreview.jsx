import React from 'react';
import { X } from 'lucide-react';
import ModernTemplate from '../Templates/ModernTemplate';
import MinimalTemplate from '../Templates/MinimalTemplate';
import CreativeTemplate from '../Templates/CreativeTemplate';
import { TEMPLATES } from '../../utils/constants';

const PortfolioPreview = ({ profile, projects, onClose }) => {
  const getTemplate = () => {
    switch (profile?.template) {
      case TEMPLATES.MINIMAL:
        return <MinimalTemplate profile={profile} projects={projects} />;
      case TEMPLATES.CREATIVE:
        return <CreativeTemplate profile={profile} projects={projects} />;
      case TEMPLATES.MODERN:
      default:
        return <ModernTemplate profile={profile} projects={projects} />;
    }
  };

  return (
    <div className="preview-modal">
      <div className="preview-header">
        <h2>Portfolio Preview</h2>
        <button onClick={onClose} className="close-btn">
          <X size={24} />
        </button>
      </div>
      <div className="preview-content">
        {getTemplate()}
      </div>
    </div>
  );
};

export default PortfolioPreview;