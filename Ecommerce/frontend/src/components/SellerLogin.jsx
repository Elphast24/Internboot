import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../redux/slices/authSlice';
import './SellerAuth.css';

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/auth/login`,
        { email, password }
      );

      localStorage.setItem('sellerToken', response.data.token);
      localStorage.setItem('seller', JSON.stringify(response.data.seller));
      navigate('/seller/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-auth-container">
      <div className="seller-auth-box">
        <h2>Seller Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>Don't have an account? <Link to="/seller/register">Register</Link></p>
      </div>
    </div>
  );
};

export default SellerLogin;