import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sellerToken = localStorage.getItem('sellerToken');

  useEffect(() => {
    if (!sellerToken) {
      navigate('/seller/login');
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [profileRes, statsRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/seller/auth/profile`, {
          headers: { Authorization: `Bearer ${sellerToken}` }
        }),
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/seller/orders/dashboard/stats`, {
          headers: { Authorization: `Bearer ${sellerToken}` }
        }),
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/seller/orders`, {
          headers: { Authorization: `Bearer ${sellerToken}` }
        })
      ]);

      setSeller(profileRes.data);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {seller?.shopName}</h1>
        <div className="seller-info">
          <p>📧 {seller?.email}</p>
          <p>📱 {seller?.phone}</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${(stats.totalRevenue || 0).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Shop Rating</h3>
          <p className="stat-value">⭐ {seller?.rating || 0}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        <div className="orders-table">
          <div className="table-header">
            <div>Order ID</div>
            <div>Customer</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {orders.slice(0, 10).map((order) => (
            <div key={order._id} className="table-row">
              <div>{order._id.substring(0, 8)}</div>
              <div>{order.userId?.name}</div>
              <div>${order.totalPrice}</div>
              <div className={`status ${order.status}`}>{order.status}</div>
              <button onClick={() => navigate(`/seller/order/${order._id}`)}>View</button>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate('/seller/products')}>Manage Products</button>
        <button onClick={() => navigate('/seller/profile')}>Edit Profile</button>
      </div>
    </div>
  );
};

export default SellerDashboard;