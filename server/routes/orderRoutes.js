const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);

module.exports = router;