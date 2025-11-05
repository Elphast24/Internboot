import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SellerAuth.css';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/auth/register`,
        formData
      );

      localStorage.setItem('sellerToken', response.data.token);
      localStorage.setItem('seller', JSON.stringify(response.data.seller));
      navigate('/seller/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-auth-container">
      <div className="seller-auth-box">
        <h2>Seller Registration</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="shopName"
            placeholder="Shop Name"
            value={formData.shopName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Seller'}
          </button>
        </form>
        <p>Already have an account? <Link to="/seller/login">Login</Link></p>
      </div>
    </div>
  );
};

export default SellerRegister;