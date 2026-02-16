const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/', protect, addToCart); // Add item
router.delete('/:itemId', protect, removeFromCart); // Remove item
router.put('/:itemId', protect, updateCartItem); // Update quantity

module.exports = router;