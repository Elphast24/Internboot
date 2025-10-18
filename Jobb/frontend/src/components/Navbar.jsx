import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Jobb
        </Link>

        <div className="navbar-links">
          <Link to="/jobs">Browse Jobs</Link>
          
          {user && user.role === 'employer' && (
            <Link to="/post-job">Post Job</Link>
          )}

          {user && user.role === 'job_seeker' && (
            <Link to="/my-applications">My Applications</Link>
          )}

          {user && user.role === 'employer' && (
            <Link to="/my-jobs">My Jobs</Link>
          )}

          {user ? (
            <div className="navbar-user">
              <span className="user-name">Hello, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;