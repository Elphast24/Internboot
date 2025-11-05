const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const product = new Product({
      sellerId: req.user.id,
      name,
      description,
      price,
      category,
      stock,
      image
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProductStats = async (req, res) => {
  try {
    console.log('Fetching product stats for seller:', req.user.id);

    // Convert to ObjectId properly
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    // Count total products
    const totalProducts = await Product.countDocuments({ sellerId: sellerId });
    console.log('Total products:', totalProducts);

    // Calculate total stock
    const stockResult = await Product.aggregate([
      { $match: { sellerId: sellerId } },
      { $group: { _id: null, totalStock: { $sum: '$stock' } } }
    ]);

    const totalStock = stockResult.length > 0 ? stockResult[0].totalStock : 0;
    console.log('Total stock:', totalStock);

    res.status(200).json({
      totalProducts,
      totalStock
    });
  } catch (error) {
    console.error('Product stats error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};