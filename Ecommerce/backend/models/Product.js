const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    image: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);