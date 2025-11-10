import React, { useState, useEffect } from 'react';
import { Camera, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveProfile } from '../../services/profile.service';
import { useImageUpload } from '../../hooks/useImageUpload';
import { validateProfileForm } from '../../utils/validators';
import { SUCCESS_MESSAGES, TEMPLATES, TEMPLATE_NAMES } from '../../utils/constants';
import '../../styles/profile.css';

const ProfileEditor = () => {
  const { user, profile, setProfile } = useAuth();
  const { uploadProfile, uploading } = useImageUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    photoURL: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    skills: [],
    metaTitle: '',
    metaDescription: '',
    template: 'modern'
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({ ...formData, ...profile });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { url, error } = await uploadProfile(file);
      if (url) {
        setFormData({ ...formData, photoURL: url });
      } else {
        setErrors({ ...errors, photoURL: error });
      }
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ 
        ...formData, 
        skills: [...formData.skills, newSkill.trim()] 
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    // Validate form
    const validation = validateProfileForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);

    const { success, error } = await saveProfile(user.uid, formData);

    setSaving(false);

    if (success) {
      setProfile(formData);
      setMessage(SUCCESS_MESSAGES.PROFILE_UPDATED);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setErrors({ general: error });
    }
  };

  return (
    <div className="profile-section">
      <h1>Edit Profile</h1>

      {message && <div className="success-message">{message}</div>}
      {errors.general && <div className="error-message">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="profile-photo-section">
          <div className="photo-preview">
            {formData.photoURL ? (
              <img src={formData.photoURL} alt="Profile" />
            ) : (
              <User size={60} />
            )}
          </div>
          <label className="photo-upload-btn">
            <Camera size={20} />
            {uploading ? 'Uploading...' : 'Upload Photo'}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          {errors.photoURL && <span className="field-error">{errors.photoURL}</span>}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="4"
          />
        </div>

        <h3>Social Links</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
            {errors.website && <span className="field-error">{errors.website}</span>}
          </div>

          <div className="form-group">
            <label>GitHub</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
            {errors.github && <span className="field-error">{errors.github}</span>}
          </div>

          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedin && <span className="field-error">{errors.linkedin}</span>}
          </div>

          <div className="form-group">
            <label>Twitter</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
            />
            {errors.twitter && <span className="field-error">{errors.twitter}</span>}
          </div>
        </div>

        <h3>Skills</h3>
        <div className="skills-input">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add a skill (e.g., React, Node.js)"
          />
          <button type="button" onClick={addSkill} className="btn-secondary">
            Add
          </button>
        </div>

        <div className="skills-list">
          {formData.skills.map(skill => (
            <span key={skill} className="skill-tag">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)}>×</button>
            </span>
          ))}
        </div>

        <h3>SEO Settings</h3>
        <div className="form-group full-width">
          <label>Portfolio Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="John Doe - Full Stack Developer"
          />
        </div>

        <div className="form-group full-width">
          <label>Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="Portfolio of John Doe, a passionate full-stack developer..."
            rows="3"
          />
        </div>

        <h3>Template</h3>
        <div className="template-selector">
          {Object.values(TEMPLATES).map(template => (
            <label key={template} className={formData.template === template ? 'active' : ''}>
              <input
                type="radio"
                name="template"
                value={template}
                checked={formData.template === template}
                onChange={handleChange}
              />
              <span>{TEMPLATE_NAMES[template]}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="btn-primary save-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;