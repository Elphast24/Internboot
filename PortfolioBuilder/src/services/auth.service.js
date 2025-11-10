import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  const googleProvider = new GoogleAuthProvider();
  
  // Sign up with email and password
  export const signUpWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Sign in with email and password
  export const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Sign in with Google
  export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Sign out
  export const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Listen to auth state changes
  export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // Get current user
  export const getCurrentUser = () => {
    return auth.currentUser;
  };