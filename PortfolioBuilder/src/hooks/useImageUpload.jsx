import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  uploadProfilePhoto,
  uploadProjectImage,
  uploadMultipleImages,
  validateImageFile
} from '../services/storage.service';

export const useImageUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Upload single profile photo
  const uploadProfile = async (file) => {
    if (!user) {
      return { url: null, error: 'User not authenticated' };
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return { url: null, error: validation.error };
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const { url, error: uploadError } = await uploadProfilePhoto(user.uid, file);

    setUploading(false);
    setProgress(100);

    if (uploadError) {
      setError(uploadError);
      return { url: null, error: uploadError };
    }

    return { url, error: null };
  };

  // Upload single project image
  const uploadSingleProjectImage = async (file) => {
    if (!user) {
      return { url: null, error: 'User not authenticated' };
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return { url: null, error: validation.error };
    }

    setUploading(true);
    setError(null);

    const { url, error: uploadError } = await uploadProjectImage(user.uid, file);

    setUploading(false);

    if (uploadError) {
      setError(uploadError);
      return { url: null, error: uploadError };
    }

    return { url, error: null };
  };

  // Upload multiple project images
  const uploadProjectImages = async (files) => {
    if (!user) {
      return { urls: [], error: 'User not authenticated' };
    }

    // Validate all files
    const validFiles = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        setError(validation.error);
      }
    }

    if (validFiles.length === 0) {
      return { urls: [], error: 'No valid files to upload' };
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const { urls, error: uploadError } = await uploadMultipleImages(user.uid, validFiles);

    setUploading(false);
    setProgress(100);

    if (uploadError) {
      setError(uploadError);
    }

    return { urls, error: uploadError };
  };

  return {
    uploading,
    progress,
    error,
    uploadProfile,
    uploadSingleProjectImage,
    uploadProjectImages,
    clearError: () => setError(null)
  };
};