require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// User Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

// Seller Routes
const sellerAuthRoutes = require('./routes/sellerAuth');
const sellerProductRoutes = require('./routes/sellerProducts');
const sellerOrderRoutes = require('./routes/sellerOrder');

// Payment Routes ✅ ADD THIS
const paymentRoutes = require('./routes/payment');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// User Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Seller Routes
app.use('/api/seller/auth', sellerAuthRoutes);
app.use('/api/seller/products', sellerProductRoutes);
app.use('/api/seller/orders', sellerOrderRoutes);

// Payment Routes ✅ ADD THIS
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running' });
});

// Test route
app.get('/api/test-payment', (req, res) => {
  res.json({ 
    message: 'Payment routes are active',
    routes: [
      'POST /api/payment/razorpay/create-order',
      'POST /api/payment/razorpay/verify',
      'POST /api/payment/stripe/create-checkout',
      'POST /api/payment/stripe/verify'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Payment routes available at /api/payment');
});

module.exports = app;