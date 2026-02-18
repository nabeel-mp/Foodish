const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, getUserDetails, toggleUserBlock } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserDetails);
router.delete('/users/:id', protect, admin, deleteUser);
router.patch('/users/:id/block', protect, admin, toggleUserBlock);


module.exports = router;