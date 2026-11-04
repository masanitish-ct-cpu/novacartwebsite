const express = require('express');
const router = express.Router();
const { getDashboard, getAllOrders, updateOrderStatus, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboard);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
