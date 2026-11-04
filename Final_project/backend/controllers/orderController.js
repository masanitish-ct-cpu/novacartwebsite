const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, subtotal, shippingPrice, discount, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  // validate stock & decrement
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    product.stock -= item.quantity;
    product.soldCount = (product.soldCount || 0) + item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
    subtotal: subtotal || 0,
    shippingPrice: shippingPrice || 0,
    discount: discount || 0,
    totalPrice: totalPrice || 0,
    orderStatus: 'Pending',
  });

  // clear cart
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.status(201).json({ success: true, data: order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json({ success: true, data: order });
});

module.exports = { createOrder, getMyOrders, getOrderById };
