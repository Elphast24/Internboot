import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
  } from 'firebase/storage';
  import { storage } from './firebase';
  
  // Upload profile photo
  export const uploadProfilePhoto = async (userId, file) => {
    try {
      const storageRef = ref(storage, `profiles/${userId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { url: downloadURL, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  };
  
  // Upload project image
  export const uploadProjectImage = async (userId, file) => {
    try {
      const storageRef = ref(storage, `projects/${userId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { url: downloadURL, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  };
  
  // Upload multiple project images
  export const uploadMultipleImages = async (userId, files) => {
    try {
      const uploadPromises = files.map(file => uploadProjectImage(userId, file));
      const results = await Promise.all(uploadPromises);
      
      const urls = results
        .filter(result => result.url !== null)
        .map(result => result.url);
      
      const errors = results
        .filter(result => result.error !== null)
        .map(result => result.error);
      
      return { 
        urls, 
        error: errors.length > 0 ? errors.join(', ') : null 
      };
    } catch (error) {
      return { urls: [], error: error.message };
    }
  };
  
  // Delete image from storage
  export const deleteImage = async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Get image download URL
  export const getImageUrl = async (imagePath) => {
    try {
      const imageRef = ref(storage, imagePath);
      const url = await getDownloadURL(imageRef);
      return { url, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  };
  
  // Validate file type
  export const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
    }
    
    return { valid: true, error: null };
  };