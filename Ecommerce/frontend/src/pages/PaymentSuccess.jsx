import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  return (
    <div className="payment-result-container">
      <div className="payment-result-box success">
        <div className="icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your order has been confirmed</p>
        <p className="order-id">Order ID: {orderId}</p>
        <div className="actions">
          <button onClick={() => navigate('/orders')}>View Orders</button>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;