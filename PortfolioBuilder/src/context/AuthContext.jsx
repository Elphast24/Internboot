import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChange } from '../services/auth.service';
import { getProfile, createProfile } from '../services/profile.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Load user profile
        const { profile: userProfile, error } = await getProfile(currentUser.uid);
        
        if (!userProfile && !error) {
          // Create initial profile if doesn't exist
          await createProfile(currentUser.uid, {
            email: currentUser.email,
            name: currentUser.displayName || '',
            photoURL: currentUser.photoURL || '',
            bio: '',
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
          
          // Reload profile
          const { profile: newProfile } = await getProfile(currentUser.uid);
          setProfile(newProfile);
        } else {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    setProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};