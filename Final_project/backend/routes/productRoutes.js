const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getRelated,
  getCategories,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/:id/related', getRelated);
router.post('/:id/reviews', protect, createReview);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
