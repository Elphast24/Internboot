const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${randomStr}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    console.log('Creating order for user:', req.user.id);
    
    // Fetch cart with populated product details
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    console.log('Cart found:', cart ? 'Yes' : 'No');
    console.log('Cart items count:', cart?.items?.length || 0);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Group items by seller
    const ordersBySeller = {};

    for (const item of cart.items) {
      // Handle both populated and non-populated productId
      const productIdStr = typeof item.productId === 'string' 
        ? item.productId 
        : item.productId?._id?.toString();

      if (!productIdStr) {
        console.log('Skipping item - no product ID:', item);
        continue;
      }

      console.log('Processing product:', productIdStr);

      const product = await Product.findById(productIdStr);
      
      if (!product) {
        console.log('Product not found:', productIdStr);
        return res.status(400).json({ 
          message: `Product not found: ${item.productId?.name || productIdStr}` 
        });
      }

      console.log('Product found:', product.name, 'Seller:', product.sellerId);

      // Check if product has seller
      if (!product.sellerId) {
        console.log('Product has no seller:', product.name);
        return res.status(400).json({ 
          message: `Product "${product.name}" has no seller assigned. Please contact support.` 
        });
      }

      const sellerId = product.sellerId.toString();

      if (!ordersBySeller[sellerId]) {
        ordersBySeller[sellerId] = {
          sellerId: sellerId,
          items: [],
          totalPrice: 0
        };
      }

      ordersBySeller[sellerId].items.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: item.price
      });

      ordersBySeller[sellerId].totalPrice += item.price * item.quantity;
    }

    console.log('Orders by seller:', Object.keys(ordersBySeller).length);

    // Check if we have any orders to create
    if (Object.keys(ordersBySeller).length === 0) {
      return res.status(400).json({ 
        message: 'No valid products found in cart' 
      });
    }

    // Create separate orders for each seller
    const createdOrders = [];

    for (const sellerId in ordersBySeller) {
      const orderData = ordersBySeller[sellerId];

      console.log('Creating order for seller:', sellerId);

      const order = new Order({
        orderId: generateOrderId(),
        userId: req.user.id,
        sellerId: orderData.sellerId,
        items: orderData.items,
        totalPrice: orderData.totalPrice,
        shippingAddress,
        status: 'pending',
        paymentStatus: 'pending'
      });

      await order.save();
      console.log('Order created:', order.orderId);
      createdOrders.push(order);
    }

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    console.log('Cart cleared. Total orders created:', createdOrders.length);

    res.status(201).json({
      message: 'Order(s) placed successfully',
      orders: createdOrders
    });
  } catch (error) {
    console.error('Order creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('sellerId', 'shopName email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('sellerId', 'shopName email phone')
      .populate('userId', 'name email');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

