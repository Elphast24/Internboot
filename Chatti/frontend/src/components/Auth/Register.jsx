import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import '../../styles/Auth.css';
import logo from '../../assets/chatti.png'

const Register = ({ onSuccess, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const { name, email, password, confirmPassword } = formData;

  // Update avatar preview when name changes
  useEffect(() => {
    if (name.trim()) {
      const seed = encodeURIComponent(name.trim());
      setAvatarUrl(`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`);
    } else {
      setAvatarUrl('');
    }
  }, [name]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration with:', { name, email });
      
      const { data } = await axios.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      console.log('Registration successful:', data);
      
      if (data && data.token) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        onSuccess(data);
      } else {
        console.error('No token in response:', data);
        setError('Registration failed. No authentication token received.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Registration failed. Please try again.');
      } else if (err.request) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo" >
          <img src={logo} alt="Chatti Logo"/>
        </div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Sign up to get started</p>

        {/* Avatar Preview */}
        {avatarUrl && (
          <div className="avatar-preview">
            <img src={avatarUrl} alt="Your avatar" />
            <p>Your profile picture</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Enter your username"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              placeholder="Confirm your password"
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <span onClick={switchToLogin}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;