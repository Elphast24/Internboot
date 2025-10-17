import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const TestFirebase = () => {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
        setStatus('Testing Firebase connection...');
        
        // Test 1: Authentication
        console.log('1. Testing Auth...');
        console.log('Auth instance:', auth);
        setStatus('Auth instance loaded...');

        // Test 2: Firestore - Try to write first
        console.log('2. Testing Firestore write...');
        const testDocRef = await addDoc(collection(db, 'test-collection'), {
          message: 'Test connection',
          timestamp: new Date(),
          test: true
        });
        console.log('✅ Firestore write successful! Document ID:', testDocRef.id);
        setStatus('Firestore write successful!');

        // Test 3: Firestore - Try to read
        console.log('3. Testing Firestore read...');
        const querySnapshot = await getDocs(collection(db, 'test-collection'));
        console.log('✅ Firestore read successful! Documents:', querySnapshot.size);
        setStatus('Firestore read successful!');

        // Test 4: Clean up - delete test document
        console.log('4. Cleaning up test document...');
        await deleteDoc(doc(db, 'test-collection', testDocRef.id));
        console.log('✅ Cleanup successful!');
        setStatus('✅ All Firebase tests passed!');

        console.log('🎉 Firebase setup is working correctly!');

      } catch (error) {
        console.error('❌ Firebase connection error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    testFirebaseConnection();
  }, []);

  const testAuth = async () => {
    try {
      setStatus('Testing authentication...');
      
      // Test creating a user (use a unique email each time)
      const testEmail = `test${Date.now()}@test.com`;
      const testPassword = 'password123';
      
      console.log('Testing user creation...');
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ User created:', userCredential.user.uid);
      setStatus('User creation successful!');
      
      // Sign out
      await auth.signOut();
      console.log('✅ Signed out successfully');
      
    } catch (error) {
      console.error('Auth test error:', error);
      setStatus(`Auth Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>Firebase Setup Test</h3>
      <div style={{ margin: '10px 0', padding: '10px', background: 'white', borderRadius: '4px' }}>
        <strong>Status:</strong> {status}
      </div>
      <button 
        onClick={testAuth}
        style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}
      >
        Test Authentication
      </button>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Check the browser console for detailed connection status.
      </p>
    </div>
  );
};

export default TestFirebase;