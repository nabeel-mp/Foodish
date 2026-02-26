const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getAllOrders, updateOrderStatus, placeOrderStripe, verifyOrder, cancelOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/allorders', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

router.post('/place-stripe', protect, placeOrderStripe);
router.post('/verify', protect, verifyOrder);

module.exports = router;
