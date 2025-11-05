const Razorpay = require('razorpay');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// ========== RAZORPAY ==========

// exports.createRazorpayOrder = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;

//     console.log('Creating Razorpay order:', orderId, amount);

//     const order = await Order.findOne({ orderId, userId: req.user.id });
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const options = {
//       amount: Math.round(amount * 100),
//       currency: 'INR',
//       receipt: orderId,
//       payment_capture: 1
//     };

//     const razorpayOrder = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       orderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       keyId: process.env.RAZORPAY_KEY_ID
//     });
//   } catch (error) {
//     console.error('Razorpay error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.verifyRazorpayPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

//     const body = razorpay_order_id + '|' + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: 'Payment verification failed' });
//     }

//     const order = await Order.findOneAndUpdate(
//       { orderId },
//       { 
//         paymentStatus: 'paid',
//         status: 'confirmed',
//         paymentId: razorpay_payment_id,
//         paymentMethod: 'razorpay',
//         updatedAt: Date.now()
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Payment verified successfully',
//       order
//     });
//   } catch (error) {
//     console.error('Verification error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// ========== STRIPE ==========

exports.createStripeCheckout = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log('Creating Stripe checkout for order:', orderId);

    const order = await Order.findOne({ orderId, userId: req.user.id }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `Quantity: ${item.quantity}`
        },
        unit_amount: Math.round(item.price * 100) // price in dollars × 100 = cents
      },
      quantity: item.quantity
    }));
    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.PAYMENT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.PAYMENT_CANCEL_URL}?order_id=${orderId}`,
      metadata: {
        orderId: orderId,
        userId: req.user.id.toString()
      }
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyStripePayment = async (req, res) => {
  try {
    const { sessionId, orderId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const order = await Order.findOneAndUpdate(
        { orderId },
        { 
          paymentStatus: 'paid',
          status: 'confirmed',
          paymentId: session.payment_intent,
          paymentMethod: 'stripe',
          updatedAt: Date.now()
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Stripe verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      orderId: order.orderId,
      paymentStatus: order.paymentStatus,
      status: order.status,
      totalPrice: order.totalPrice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};