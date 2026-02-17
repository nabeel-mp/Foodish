const express = require('express');
const router = express.flatten? express.Router() : express.Router(); // Safer
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/userDetails', protect, admin, getAllUsers); // Admin Route

module.exports = router;