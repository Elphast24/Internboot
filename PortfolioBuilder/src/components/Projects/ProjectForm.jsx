import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { validateProjectForm } from '../../utils/validators';
import '../../styles/modal.css';

const ProjectForm = ({ project, onSave, onCancel }) => {
  const { uploadProjectImages, uploading } = useImageUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    images: []
  });
  
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        technologies: project.technologies || '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        images: project.images || []
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const { urls, error } = await uploadProjectImages(files);
    
    if (urls.length > 0) {
      setFormData({ 
        ...formData, 
        images: [...formData.images, ...urls] 
      });
    }
    
    if (error) {
      setErrors({ ...errors, images: error });
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = validateProjectForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="modal" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button className="modal-close" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Awesome Project"
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project..."
              rows="4"
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Technologies (comma-separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="form-group">
            <label>Live URL</label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://project.com"
            />
            {errors.liveUrl && <span className="field-error">{errors.liveUrl}</span>}
          </div>

          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
            />
            {errors.githubUrl && <span className="field-error">{errors.githubUrl}</span>}
          </div>

          <div className="form-group">
            <label>Project Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <span className="uploading-text">Uploading images...</span>}
            {errors.images && <span className="field-error">{errors.images}</span>}
            
            {formData.images.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="image-preview-item">
                    <img src={img} alt={`Preview ${idx + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn-secondary"
              disabled={saving || uploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving || uploading}
            >
              {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;