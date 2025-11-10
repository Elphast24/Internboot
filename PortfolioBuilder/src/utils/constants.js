// Application Constants

export const TEMPLATES = {
    MODERN: 'modern',
    MINIMAL: 'minimal',
    CREATIVE: 'creative'
  };
  
  export const TEMPLATE_NAMES = {
    [TEMPLATES.MODERN]: 'Modern',
    [TEMPLATES.MINIMAL]: 'Minimal',
    [TEMPLATES.CREATIVE]: 'Creative'
  };
  
  export const TEMPLATE_DESCRIPTIONS = {
    [TEMPLATES.MODERN]: 'Vibrant gradients with a contemporary design',
    [TEMPLATES.MINIMAL]: 'Clean and simple with elegant typography',
    [TEMPLATES.CREATIVE]: 'Bold and artistic with unique layouts'
  };
  
  export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  export const SOCIAL_PLATFORMS = {
    GITHUB: 'github',
    LINKEDIN: 'linkedin',
    TWITTER: 'twitter',
    WEBSITE: 'website'
  };
  
  export const ERROR_MESSAGES = {
    AUTH_FAILED: 'Authentication failed. Please try again.',
    PROFILE_UPDATE_FAILED: 'Failed to update profile. Please try again.',
    PROJECT_CREATE_FAILED: 'Failed to create project. Please try again.',
    PROJECT_UPDATE_FAILED: 'Failed to update project. Please try again.',
    PROJECT_DELETE_FAILED: 'Failed to delete project. Please try again.',
    IMAGE_UPLOAD_FAILED: 'Failed to upload image. Please try again.',
    INVALID_FILE_TYPE: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
    FILE_TOO_LARGE: 'File size too large. Maximum size is 5MB.',
    NETWORK_ERROR: 'Network error. Please check your connection.'
  };
  
  export const SUCCESS_MESSAGES = {
    PROFILE_UPDATED: 'Profile updated successfully!',
    PROJECT_CREATED: 'Project created successfully!',
    PROJECT_UPDATED: 'Project updated successfully!',
    PROJECT_DELETED: 'Project deleted successfully!',
    IMAGE_UPLOADED: 'Image uploaded successfully!'
  };
  
  export const TABS = {
    DASHBOARD: 'dashboard',
    PROFILE: 'profile',
    PROJECTS: 'projects',
    PREVIEW: 'preview'
  };
  
  export const DEFAULT_PROFILE = {
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
    template: TEMPLATES.MODERN
  };
  
  export const DEFAULT_PROJECT = {
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    images: []
  };