const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser,
     getUserDetails, toggleUserBlock, createDeliveryBoy, getDeliveryBoys, deleteDeliveryBoy, getDeliveryBoyDetails,
     getAccountsSummary, getExpenses, createExpense, deleteExpense, getDeliveryWageLedger, createDeliveryWagePayment } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserDetails);
router.delete('/users/:id', protect, admin, deleteUser);
router.patch('/users/:id/block', protect, admin, toggleUserBlock);
router.post('/delivery-boys', protect, admin, createDeliveryBoy);
router.get('/delivery-boys', protect, admin, getDeliveryBoys);
router.get('/delivery-boys/:id', protect, admin, getDeliveryBoyDetails);
router.delete('/delivery-boys/:id', protect, admin, deleteDeliveryBoy);
router.get('/accounts/summary', protect, admin, getAccountsSummary);
router.get('/accounts/expenses', protect, admin, getExpenses);
router.post('/accounts/expenses', protect, admin, createExpense);
router.delete('/accounts/expenses/:id', protect, admin, deleteExpense);
router.get('/accounts/wages', protect, admin, getDeliveryWageLedger);
router.post('/accounts/wages/pay', protect, admin, createDeliveryWagePayment);


module.exports = router;
