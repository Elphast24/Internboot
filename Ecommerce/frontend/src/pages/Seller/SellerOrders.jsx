import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerOrders.css';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const sellerToken = localStorage.getItem('sellerToken');

  useEffect(() => {
    if (!sellerToken) {
      navigate('/seller/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/orders`,
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
      fetchOrders();
      alert('Order status updated!');
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="seller-orders">
      <h1>Order Management</h1>

      <div className="filter-options">
        <button 
          onClick={() => setFilterStatus('all')}
          className={filterStatus === 'all' ? 'active' : ''}
        >
          All Orders ({orders.length})
        </button>
        <button 
          onClick={() => setFilterStatus('pending')}
          className={filterStatus === 'pending' ? 'active' : ''}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilterStatus('confirmed')}
          className={filterStatus === 'confirmed' ? 'active' : ''}
        >
          Confirmed
        </button>
        <button 
          onClick={() => setFilterStatus('shipped')}
          className={filterStatus === 'shipped' ? 'active' : ''}
        >
          Shipped
        </button>
        <button 
          onClick={() => setFilterStatus('delivered')}
          className={filterStatus === 'delivered' ? 'active' : ''}
        >
          Delivered
        </button>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Items</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Payment</div>
          <div>Action</div>
        </div>

        {filteredOrders.map((order) => (
          <div key={order._id} className="table-row">
            <div className="order-id">{order._id.substring(0, 8)}</div>
            <div className="customer">{order.userId?.name}</div>
            <div className="items">{order.items.length} items</div>
            <div className="amount">${order.totalPrice}</div>
            <div className={`status ${order.status}`}>{order.status}</div>
            <div className={`payment ${order.paymentStatus}`}>{order.paymentStatus}</div>
            <div className="actions">
              <select 
                value={order.status}
                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => navigate(`/seller/order/${order._id}`)}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerOrders;