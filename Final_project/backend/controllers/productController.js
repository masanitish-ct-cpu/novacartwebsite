const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// @desc Get products with search/filter/sort/pagination
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { $or: [{ name: { $regex: req.query.keyword, $options: 'i' } }, { description: { $regex: req.query.keyword, $options: 'i' } }, { category: { $regex: req.query.keyword, $options: 'i' } }] }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const priceFilter = {};
  if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
  const price = Object.keys(priceFilter).length ? { price: priceFilter } : {};

  const rating = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

  const inStock = req.query.inStock === 'true' ? { stock: { $gt: 0 } } : {};

  const filter = { ...keyword, ...category, ...price, ...rating, ...inStock };

  let sort = {};
  switch (req.query.sort) {
    case 'price_asc':
      sort = { price: 1 };
      break;
    case 'price_desc':
      sort = { price: -1 };
      break;
    case 'rating':
      sort = { rating: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'popular':
      sort = { soldCount: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    data: products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, data: updated });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});

// @desc Create review
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) {
    res.status(400);
    throw new Error('Product already reviewed');
  }
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc Related products
const getRelated = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(8);
  res.json({ success: true, data: related });
});

// @desc Categories list
const getCategories = asyncHandler(async (req, res) => {
  const cats = await Product.distinct('category');
  res.json({ success: true, data: cats });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getRelated,
  getCategories,
};
