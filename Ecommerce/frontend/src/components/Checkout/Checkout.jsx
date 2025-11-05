import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../../redux/slices/cartSlice';
import PaymentGateway from '../Payment/PaymentGateway';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrders, setCreatedOrders] = useState([]);

  if (!token) {
    navigate('/login');
    return null;
  }

  if (items.length === 0 && !orderCreated) {
    return (
      <div className="checkout-container">
        <p>Your cart is empty. Please add items before checkout.</p>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      alert('Please enter shipping address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/orders`,
        { shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(clearCart());
      
      const orders = response.data.orders || [response.data.order];
      setCreatedOrders(orders);
      setOrderCreated(true);
      
      alert(`Order created successfully! Please proceed to payment.`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (order) => {
    alert(`Payment successful! Order ${order.orderId} confirmed.`);
    navigate('/orders');
  };

  const handlePaymentFailure = (error) => {
    alert(`Payment failed: ${error}`);
  };

  if (orderCreated && createdOrders.length > 0) {
    return (
      <div className="checkout-container">
        <h2>Complete Payment</h2>
        {createdOrders.map((order, index) => (
          <div key={order.orderId} className="payment-section">
            <h3>Order {index + 1} of {createdOrders.length}</h3>
            <PaymentGateway
              orderId={order.orderId}
              amount={order.totalPrice}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2>Checkout</h2>
          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email} disabled />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={user?.name} disabled />
            </div>
            <div className="form-group">
              <label>Shipping Address *</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your full shipping address including:&#10;Street address&#10;City&#10;State&#10;PIN code&#10;Phone number"
                rows="5"
                required
              />
            </div>
            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
            <p className="checkout-note">
              * Your items may be split into multiple orders if purchased from different sellers
            </p>
          </form>
        </div>

        <div className="order-summary-section">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map((item, index) => (
              <div key={item.productId?._id || index} className="summary-item">
                <span>
                  {item.productId?.name || 'Product'} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span className="free-shipping">FREE</span>
          </div>
          <div className="summary-total">
            <span>Total Amount:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <p className="payment-note">
            💳 Secure payment via Razorpay or Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;