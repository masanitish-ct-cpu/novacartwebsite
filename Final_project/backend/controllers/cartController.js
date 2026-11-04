const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  const items = user.cart.map((c) => ({
    product: c.product,
    quantity: c.quantity,
  }));
  res.json({ success: true, data: items });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const user = await User.findById(req.user._id);
  const idx = user.cart.findIndex((c) => c.product.toString() === productId);
  if (idx > -1) {
    user.cart[idx].quantity = Math.min(user.cart[idx].quantity + Number(quantity), product.stock || 99);
  } else {
    user.cart.push({ product: productId, quantity: Number(quantity) });
  }
  await user.save();
  const populated = await User.findById(req.user._id).populate('cart.product');
  res.json({ success: true, data: populated.cart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const idx = user.cart.findIndex((c) => c.product.toString() === req.params.productId);
  if (idx === -1) {
    res.status(404);
    throw new Error('Item not in cart');
  }
  if (quantity <= 0) {
    user.cart.splice(idx, 1);
  } else {
    user.cart[idx].quantity = Number(quantity);
  }
  await user.save();
  const populated = await User.findById(req.user._id).populate('cart.product');
  res.json({ success: true, data: populated.cart });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((c) => c.product.toString() !== req.params.productId);
  await user.save();
  const populated = await User.findById(req.user._id).populate('cart.product');
  res.json({ success: true, data: populated.cart });
});

const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ success: true, data: [] });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
