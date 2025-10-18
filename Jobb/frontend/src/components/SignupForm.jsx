import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import '../styles/auth.css';

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'job_seeker',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      onSignupSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>I am a:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div className="auth-link">
        Already have an account? <a href="/login">Login here</a>
      </div>
    </div>
  );
};

export default SignupForm;