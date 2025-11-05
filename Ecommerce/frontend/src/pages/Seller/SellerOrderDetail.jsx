import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerOrderDetail.css';

const SellerOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sellerToken = localStorage.getItem('sellerToken');

  useEffect(() => {
    if (!sellerToken) {
      navigate('/seller/login');
      return;
    }
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      // Fetch from seller orders endpoint
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/orders`,
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
      const foundOrder = response.data.find(o => o._id === orderId);
      setOrder(foundOrder);
      setTrackingNumber(foundOrder?.trackingNumber || '');
      setNotes(foundOrder?.notes || '');
    } catch (error) {
      console.error('Failed to fetch order', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/seller/orders/${orderId}/status`,
        { status: order.status, trackingNumber, notes },
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
      alert('Order updated successfully!');
      fetchOrderDetail();
    } catch (error) {
      alert('Failed to update order');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="order-detail">
      <button onClick={() => navigate('/seller/orders')} className="back-btn">← Back</button>

      <div className="order-header">
        <h1>Order #{order._id.substring(0, 8)}</h1>
        <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="order-content">
        <div className="customer-section">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {order.userId?.name}</p>
          <p><strong>Email:</strong> {order.userId?.email}</p>
          <p><strong>Address:</strong> {order.shippingAddress}</p>
        </div>

        <div className="items-section">
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="order-total">
            <strong>Total Amount:</strong> ${order.totalPrice}
          </div>
        </div>

        <div className="status-section">
          <h3>Order Status</h3>
          <div className="status-info">
            <div className="status-field">
              <label>Order Status:</label>
              <select 
                value={order.status}
                onChange={(e) => setOrder({ ...order, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>

            <div className="status-field">
              <label>Payment Status:</label>
              <p className={`payment-badge ${order.paymentStatus}`}>{order.paymentStatus}</p>
            </div>
          </div>
        </div>

        <div className="tracking-section">
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label>Tracking Number:</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>

          <div className="form-group">
            <label>Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this order"
              rows="4"
            />
          </div>

          <button onClick={handleUpdateOrder} className="update-btn">
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetail;