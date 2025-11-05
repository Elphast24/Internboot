import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusClass[status] || 'status-pending';
  };

  if (!isAuthenticated) return null;

  return (
    <div className="order-history-container">
      <h2>Order History</h2>

      {loading ? (
        <p className="loading">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet</p>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <div>Order ID</div>
            <div>Date</div>
            <div>Items</div>
            <div>Total</div>
            <div>Status</div>
            <div>Payment</div>
          </div>

          {orders.map((order) => (
            <div key={order._id} className="table-row">
              <div className="order-id">{order._id.substring(0, 8)}</div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="order-items">{order.items.length} items</div>
              <div className="user-order-total">${order.totalPrice.toFixed(2)}</div>
              <div className={`order-status ${getStatusBadge(order.status)}`}>
                {order.status}
              </div>
              <div className={`payment-status status-${order.paymentStatus}`}>
                {order.paymentStatus}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;