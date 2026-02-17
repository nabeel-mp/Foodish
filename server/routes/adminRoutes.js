const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, getUserDetails } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware'); 

router.get('/stats', protect, getDashboardStats);
router.get('/users', protect, getAllUsers);
router.get('/users/:id', protect, getUserDetails);
router.delete('/users/:id', protect, deleteUser);


module.exports = router;