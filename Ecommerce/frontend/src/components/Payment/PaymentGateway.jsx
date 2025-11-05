import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './PaymentGateway.css';

const PaymentGateway = ({ orderId, amount, onSuccess, onFailure }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const navigate = useNavigate();

  // Razorpay Payment
//   const handleRazorpayPayment = async () => {
//     setLoading(true);
//     try {
//       // Create Razorpay order
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_REACT_APP_API_URL}/payment/razorpay/create-order`,
//         { orderId, amount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Razorpay options
//       const options = {
//         key: data.keyId,
//         amount: data.amount,
//         currency: data.currency,
//         name: 'ShopHub',
//         description: `Order #${orderId}`,
//         order_id: data.orderId,
//         handler: async function (response) {
//           try {
//             // Verify payment
//             const verifyRes = await axios.post(
//               `${import.meta.env.VITE_REACT_APP_API_URL}/payment/razorpay/verify`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderId
//               },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (verifyRes.data.success) {
//               onSuccess(verifyRes.data.order);
//               navigate(`/payment/success?order_id=${orderId}`);
//             } else {
//               onFailure('Payment verification failed');
//             }
//           } catch (error) {
//             onFailure(error.message);
//           }
//         },
//         prefill: {
//           name: 'Customer Name',
//           email: 'customer@example.com',
//           contact: '9999999999'
//         },
//         theme: {
//           color: '#667eea'
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();

//       razorpay.on('payment.failed', function (response) {
//         onFailure(response.error.description);
//       });
//     } catch (error) {
//       console.error('Razorpay error:', error);
//       onFailure(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

  // Stripe Payment
  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/payment/stripe/create-checkout`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Stripe error:', error);
      onFailure(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else if (paymentMethod === 'stripe') {
      handleStripePayment();
    }
  };

  return (
    <div className="payment-gateway">
      <h3>Select Payment Method</h3>
      
      <div className="payment-methods">
        <div 
          className={`payment-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('razorpay')}
        >
          <input 
            type="radio" 
            name="payment" 
            value="razorpay" 
            checked={paymentMethod === 'razorpay'}
            onChange={() => setPaymentMethod('razorpay')}
          />
          <label>
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" />
            <span>Razorpay (Cards, UPI, Netbanking)</span>
          </label>
        </div>

        <div 
          className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('stripe')}
        >
          <input 
            type="radio" 
            name="payment" 
            value="stripe" 
            checked={paymentMethod === 'stripe'}
            onChange={() => setPaymentMethod('stripe')}
          />
          <label>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" />
            <span>Stripe (International Cards)</span>
          </label>
        </div>
      </div>

      <div className="payment-summary">
        <p>Order ID: <strong>{orderId}</strong></p>
        <p>Amount: <strong>${amount.toFixed(2)}</strong></p>
      </div>

      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="pay-btn"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </div>
  );
};

export default PaymentGateway;