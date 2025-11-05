const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');

const generateToken = (seller) => {
  return jwt.sign(
    { id: seller._id, role: seller.role, email: seller.email, shopName: seller.shopName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.registerSeller = async (req, res) => {
  try {
    const { name, email, password, phone, shopName, address, city, state, pincode } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists' });
    }

    const existingShop = await Seller.findOne({ shopName });
    if (existingShop) {
      return res.status(400).json({ message: 'Shop name already taken' });
    }

    const seller = new Seller({
      name,
      email,
      password,
      phone,
      shopName,
      address,
      city,
      state,
      pincode
    });

    await seller.save();

    const token = generateToken(seller);
    res.status(201).json({
      message: 'Seller registered successfully',
      token,
      seller: { id: seller._id, name: seller.name, shopName: seller.shopName, email: seller.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await seller.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(seller);
    res.status(200).json({
      message: 'Login successful',
      token,
      seller: { id: seller._id, name: seller.name, shopName: seller.shopName, email: seller.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select('-password');
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.status(200).json({ message: 'Profile updated', seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};