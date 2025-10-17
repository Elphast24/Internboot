// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy5vrQhPTrO7Yf43obHnBry04buOb5Lw4",
  authDomain: "taskme-50e1a.firebaseapp.com",
  databaseURL: "https://taskme-50e1a-default-rtdb.firebaseio.com",
  projectId: "taskme-50e1a",
  storageBucket: "taskme-50e1a.firebasestorage.app",
  messagingSenderId: "770469075511",
  appId: "1:770469075511:web:c160c524bcc8db1276fdb2",
  measurementId: "G-V9B078WFJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Export the app instance for potential future use
export default app;