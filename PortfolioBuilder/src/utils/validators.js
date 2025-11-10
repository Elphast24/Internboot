// Form validation utilities

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { valid: false, error: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true, error: null };
  };
  
  export const validatePassword = (password) => {
    if (!password) {
      return { valid: false, error: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters' };
    }
    
    return { valid: true, error: null };
  };
  
  export const validateUrl = (url) => {
    if (!url) {
      return { valid: true, error: null }; // URL is optional
    }
    
    try {
      new URL(url);
      return { valid: true, error: null };
    } catch (e) {
      return { valid: false, error: 'Invalid URL format' };
    }
  };
  
  export const validatePhone = (phone) => {
    if (!phone) {
      return { valid: true, error: null }; // Phone is optional
    }
    
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (!phoneRegex.test(phone)) {
      return { valid: false, error: 'Invalid phone number format' };
    }
    
    return { valid: true, error: null };
  };
  
  export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { valid: false, error: `${fieldName} is required` };
    }
    
    return { valid: true, error: null };
  };
  
  export const validateLength = (value, min, max, fieldName) => {
    if (!value) {
      return { valid: true, error: null };
    }
    
    if (value.length < min) {
      return { valid: false, error: `${fieldName} must be at least ${min} characters` };
    }
    
    if (max && value.length > max) {
      return { valid: false, error: `${fieldName} must not exceed ${max} characters` };
    }
    
    return { valid: true, error: null };
  };
  
  export const validateProjectForm = (project) => {
    const errors = {};
    
    const titleValidation = validateRequired(project.title, 'Title');
    if (!titleValidation.valid) {
      errors.title = titleValidation.error;
    }
    
    const descValidation = validateRequired(project.description, 'Description');
    if (!descValidation.valid) {
      errors.description = descValidation.error;
    }
    
    if (project.liveUrl) {
      const liveUrlValidation = validateUrl(project.liveUrl);
      if (!liveUrlValidation.valid) {
        errors.liveUrl = liveUrlValidation.error;
      }
    }
    
    if (project.githubUrl) {
      const githubUrlValidation = validateUrl(project.githubUrl);
      if (!githubUrlValidation.valid) {
        errors.githubUrl = githubUrlValidation.error;
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export const validateProfileForm = (profile) => {
    const errors = {};
    
    if (profile.email) {
      const emailValidation = validateEmail(profile.email);
      if (!emailValidation.valid) {
        errors.email = emailValidation.error;
      }
    }
    
    if (profile.phone) {
      const phoneValidation = validatePhone(profile.phone);
      if (!phoneValidation.valid) {
        errors.phone = phoneValidation.error;
      }
    }
    
    if (profile.website) {
      const websiteValidation = validateUrl(profile.website);
      if (!websiteValidation.valid) {
        errors.website = websiteValidation.error;
      }
    }
    
    if (profile.github) {
      const githubValidation = validateUrl(profile.github);
      if (!githubValidation.valid) {
        errors.github = githubValidation.error;
      }
    }
    
    if (profile.linkedin) {
      const linkedinValidation = validateUrl(profile.linkedin);
      if (!linkedinValidation.valid) {
        errors.linkedin = linkedinValidation.error;
      }
    }
    
    if (profile.twitter) {
      const twitterValidation = validateUrl(profile.twitter);
      if (!twitterValidation.valid) {
        errors.twitter = twitterValidation.error;
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };