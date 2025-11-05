import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  return (
    <div className="payment-result-container">
      <div className="payment-result-box cancel">
        <div className="icon">✗</div>
        <h1>Payment Cancelled</h1>
        <p>Your payment was not completed</p>
        <p className="order-id">Order ID: {orderId}</p>
        <div className="actions">
          <button onClick={() => navigate('/checkout')}>Try Again</button>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;