// ========================================
// FILE 1: server/controllers/sellerOrderController.js
// COMPLETE VERSION WITH ALL IMPORTS
// ========================================

const Order = require('../models/Order');

exports.getSellerOrders = async (req, res) => {
  try {
    console.log('Getting orders for seller:', req.user.id);
    
    const orders = await Order.find({ sellerId: req.user.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects
    
    console.log('Found orders:', orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    const order = await Order.findOne({ 
      _id: req.params.id, 
      sellerId: req.user.id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;
    order.updatedAt = Date.now();

    await order.save();
    res.status(200).json({ message: 'Order updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerDashboard = async (req, res) => {
  try {
    console.log('=== Fetching dashboard for seller:', req.user.id);
    console.log('Seller role:', req.user.role);
    
    // Get all orders for this seller (simple query, no aggregation)
    const allOrders = await Order.find({ sellerId: req.user.id }).lean();
    console.log('Total orders found:', allOrders.length);

    // Calculate stats manually (safer than aggregation)
    const totalOrders = allOrders.length;
    
    // Calculate revenue from paid orders
    const totalRevenue = allOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    console.log('Total revenue:', totalRevenue);

    // Count orders by status
    const orderStats = {};
    allOrders.forEach(order => {
      const status = order.status || 'pending';
      orderStats[status] = (orderStats[status] || 0) + 1;
    });

    // Convert to array format
    const orderStatsArray = Object.keys(orderStats).map(status => ({
      _id: status,
      count: orderStats[status]
    }));

    console.log('Order stats:', orderStatsArray);

    // Get recent orders (last 10)
    const recentOrders = allOrders.slice(0, 10);

    res.status(200).json({
      totalOrders,
      totalRevenue,
      orderStats: orderStatsArray,
      recentOrders
    });
  } catch (error) {
    console.error('=== Seller dashboard error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// ========================================
// FILE 2: server/controllers/sellerProductController.js
// ========================================

const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    console.log('Creating product for seller:', req.user.id);

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
    console.log('Product created:', product._id);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    console.log('Getting products for seller:', req.user.id);
    
    const products = await Product.find({ sellerId: req.user.id }).lean();
    
    console.log('Found products:', products.length);
    res.status(200).json(products);
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      sellerId: req.user.id 
    });

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
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      sellerId: req.user.id 
    });

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
    console.log('Getting product stats for seller:', req.user.id);

    // Simple count query (no aggregation)
    const totalProducts = await Product.countDocuments({ 
      sellerId: req.user.id 
    });
    
    console.log('Total products:', totalProducts);

    // Get all products and calculate stock manually
    const products = await Product.find({ 
      sellerId: req.user.id 
    }).select('stock').lean();
    
    const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
    
    console.log('Total stock:', totalStock);

    res.status(200).json({
      totalProducts,
      totalStock
    });
  } catch (error) {
    console.error('Product stats error:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};