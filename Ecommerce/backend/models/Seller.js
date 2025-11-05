const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    shopName: { type: String, required: true, unique: true },
    description: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    bankAccount: { type: String },
    bankIFSC: { type: String },
    logo: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    role: { type: String, enum: ['seller', 'admin'], default: 'seller' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

SellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

SellerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Seller', SellerSchema);