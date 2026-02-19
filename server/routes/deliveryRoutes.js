const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware'); // Your existing auth middleware

// 1. Require user to be logged in
router.use(protect);

// 2. Custom middleware to check if the logged-in user is a Delivery Boy
const isDeliveryBoy = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Delivery personnel only." });
  }
};

// Apply the delivery boy check to all routes below
router.use(isDeliveryBoy);

// GET: Fetch the current active order for this delivery boy
router.get('/my-order', deliveryController.getMyCurrentOrder);

// PUT: Update the status of the assigned order (Shipped / Delivered)
router.put('/order/:orderId/status', deliveryController.updateOrderStatus);

module.exports = router;