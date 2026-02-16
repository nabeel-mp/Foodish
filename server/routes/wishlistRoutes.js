const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:id', protect, removeFromWishlist);

module.exports = router;