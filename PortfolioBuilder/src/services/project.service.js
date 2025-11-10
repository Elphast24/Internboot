import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Create a new project
  export const createProject = async (userId, projectData) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { projectId: docRef.id, error: null };
    } catch (error) {
      return { projectId: null, error: error.message };
    }
  };
  
  // Get all projects for a user
  export const getUserProjects = async (userId) => {
    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { projects, error: null };
    } catch (error) {
      return { projects: [], error: error.message };
    }
  };
  
  // Get a single project by ID
  export const getProject = async (projectId) => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        return { project: { id: projectDoc.id, ...projectDoc.data() }, error: null };
      } else {
        return { project: null, error: 'Project not found' };
      }
    } catch (error) {
      return { project: null, error: error.message };
    }
  };
  
  // Update a project
  export const updateProject = async (projectId, updates) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Delete a project
  export const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Get all public projects (for public portfolio view)
  export const getAllProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { projects, error: null };
    } catch (error) {
      return { projects: [], error: error.message };
    }
  };