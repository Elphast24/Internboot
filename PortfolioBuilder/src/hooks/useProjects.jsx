import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserProjects,
  createProject,
  updateProject,
  deleteProject
} from '../services/project.service';

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects
  const loadProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { projects: userProjects, error: fetchError } = await getUserProjects(user.uid);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setProjects(userProjects);
      setError(null);
    }
    
    setLoading(false);
  };

  // Create new project
  const addProject = async (projectData) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const { projectId, error: createError } = await createProject(user.uid, projectData);
    
    if (createError) {
      return { success: false, error: createError };
    }
    
    await loadProjects();
    return { success: true, projectId };
  };

  // Update existing project
  const editProject = async (projectId, updates) => {
    const { success, error: updateError } = await updateProject(projectId, updates);
    
    if (updateError) {
      return { success: false, error: updateError };
    }
    
    await loadProjects();
    return { success: true };
  };

  // Delete project
  const removeProject = async (projectId) => {
    const { success, error: deleteError } = await deleteProject(projectId);
    
    if (deleteError) {
      return { success: false, error: deleteError };
    }
    
    await loadProjects();
    return { success: true };
  };

  // Load projects when user changes
  useEffect(() => {
    loadProjects();
  }, [user]);

  return {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
    refreshProjects: loadProjects
  };
};