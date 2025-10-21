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
import JobDetail from './components/JobDetail';
import PostJob from './components/PostJob';
import MyApplications from './components/MyApplication';
import ApplicationForm from './components/ApplicationForm';
import MyJobs from './components/MyJobs';
import EmployerDashboard from './pages/EmployerDashboard';
import './index.css';

function App() {
  // const navigate = useNavigate();
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
    // navigate('/jobs');
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

      <Route path='/login' element={<LoginForm onLoginSuccess={handleLoginSuccess}/>}/>
      <Route path='/signup' element={<SignupForm onSignupSuccess={handleLoginSuccess}/>}/>

        <Route
          path="/auth"
          element={
            user ? (
              <Navigate to="/jobs" />
            ) : (
              <div>
                {new URLSearchParams(window.location.search).get('mode') ===
                'signup' ? (
                  <SignupForm onSignupSuccess={handleLoginSuccess} />
                ) : (
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                )}
              </div>
            )
          }
        />

        <Route path="/jobs" element={<JobList user={user} />} />

        <Route
          path="/jobs/:id"
          element={<JobDetail user={user} />}
        />

        <Route
          path="/apply/:id"
          element={user ? <ApplicationForm user={user} /> : <Navigate to="/auth?mode=login" />}
        />

        <Route
          path="/post-job"
          element={user ? <PostJob user={user} /> : <Navigate to="/auth" />}
        />

        <Route
          path="/post-job/:id"
          element={user ? <PostJob user={user} /> : <Navigate to="/auth" />}
        />

        <Route
          path="/my-jobs"
          element={
            user && user.role === 'employer' ? (
              <MyJobs user={user} />
            ) : (
              <Navigate to="/jobs" />
            )
          }
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

        <Route
          path="/employer-dashboard"
          element={
            user && user.role === 'employer' ? (
              <EmployerDashboard user={user} />
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
