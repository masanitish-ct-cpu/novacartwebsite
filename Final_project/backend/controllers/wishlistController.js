const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: user.wishlist });
});

const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const user = await User.findById(req.user._id);
  if (!user.wishlist.includes(req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }
  const populated = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: populated.wishlist });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  const populated = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: populated.wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
