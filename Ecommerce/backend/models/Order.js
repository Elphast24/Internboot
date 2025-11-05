const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        price: Number
      }
    ],
    paymentId: { type: String }, // Razorpay/Stripe payment ID
    paymentMethod: { 
      type: String, 
      enum: ['razorpay', 'stripe', 'cod'], 
      default: 'stripe',
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    shippingAddress: { type: String },
    trackingNumber: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);