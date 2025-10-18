import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import JobList from './components/JobList';
import PostJob from './components/PostJob';
import JobDetail from './components/JobDetail';
import MyApplications from './components/MyApplication';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
              <h1 style={{ fontSize: '6rem'}}>Welcome to Jobb</h1>
              <p>Find your dream job or hire top talent</p>
              {!user && (
                <div style={{ marginTop: '20px' }}>
                  <a href="/login" className="btn btn-primary">
                    Login
                  </a>
                  <a href="/signup" className="btn btn-primary" style={{ marginLeft: '10px' }}>
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/jobs" />
            ) : (
              <div>
                  <SignupForm onSignupSuccess={handleLoginSuccess} />
              </div>
            )
          }
        />

<Route
          path="/login"
          element={
            user ? (
              <Navigate to="/jobs" />
            ) : (
              <div>
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
              </div>
            )
          }
        />

        <Route path="/jobs/:id" element={<JobDetail user={user} />} />

        <Route path="/jobs" element={<JobList user={user} />} />

        <Route
          path="/post-job"
          element={user ? <PostJob user={user} /> : <Navigate to="/auth" />}
        />

        <Route
          path="/my-applications"
          element={
            user && user.role === 'job_seeker' ? (
              <MyApplications />
            ) : (
              <Navigate to="/jobs" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;