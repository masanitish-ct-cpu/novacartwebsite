const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const [totalProducts, totalUsers, totalOrders, revenueAgg, lowStock] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Product.find({ stock: { $lte: 5 } }).select('name stock').limit(10),
  ]);
  const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');
  res.json({
    success: true,
    data: {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      lowStock,
      recentOrders,
    },
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  res.json({ success: true, data: orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { status } = req.body;
  const allowed = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  order.orderStatus = status;
  if (status === 'Delivered') order.deliveredAt = new Date();
  if (status === 'Cancelled') order.cancelledAt = new Date();
  await order.save();
  res.json({ success: true, data: order });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

module.exports = { getDashboard, getAllOrders, updateOrderStatus, getAllUsers };
