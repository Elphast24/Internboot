import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Create or update profile
  export const saveProfile = async (userId, profileData) => {
    try {
      await setDoc(doc(db, 'profiles', userId), {
        ...profileData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Get profile by user ID
  export const getProfile = async (userId) => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      if (profileDoc.exists()) {
        return { profile: { id: profileDoc.id, ...profileDoc.data() }, error: null };
      } else {
        return { profile: null, error: 'Profile not found' };
      }
    } catch (error) {
      return { profile: null, error: error.message };
    }
  };
  
  // Create initial profile
  export const createProfile = async (userId, initialData) => {
    try {
      await setDoc(doc(db, 'profiles', userId), {
        ...initialData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Update specific profile fields
  export const updateProfile = async (userId, updates) => {
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Add skill to profile
  export const addSkill = async (userId, skill) => {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const profileDoc = await getDoc(profileRef);
      
      if (profileDoc.exists()) {
        const currentSkills = profileDoc.data().skills || [];
        if (!currentSkills.includes(skill)) {
          await updateDoc(profileRef, {
            skills: [...currentSkills, skill],
            updatedAt: serverTimestamp()
          });
        }
      }
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Remove skill from profile
  export const removeSkill = async (userId, skill) => {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const profileDoc = await getDoc(profileRef);
      
      if (profileDoc.exists()) {
        const currentSkills = profileDoc.data().skills || [];
        await updateDoc(profileRef, {
          skills: currentSkills.filter(s => s !== skill),
          updatedAt: serverTimestamp()
        });
      }
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };