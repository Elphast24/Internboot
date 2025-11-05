const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Razorpay routes
// router.post('/razorpay/create-order', authMiddleware, paymentController.createRazorpayOrder);
// router.post('/razorpay/verify', authMiddleware, paymentController.verifyRazorpayPayment);

// Stripe routes
router.post('/stripe/create-checkout', authMiddleware, paymentController.createStripeCheckout);
router.post('/stripe/verify', authMiddleware, paymentController.verifyStripePayment);

// Common routes
router.get('/status/:orderId', authMiddleware, paymentController.getPaymentStatus);

module.exports = router;