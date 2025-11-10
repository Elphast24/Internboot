// Helper utility functions

export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  export const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  export const getInitials = (name) => {
    if (!name) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  export const debounce = (func, wait) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  export const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  export const downloadAsFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  export const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };
  
  export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  };
  
  export const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };
  
  export const generateMetaDescription = (bio, maxLength = 160) => {
    if (!bio) return '';
    return truncateText(bio, maxLength);
  };
  
  export const parseSkills = (skillsString) => {
    if (!skillsString) return [];
    return skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  };
  
  export const parseTechnologies = (techString) => {
    if (!techString) return [];
    return techString
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);
  };
  
  export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };