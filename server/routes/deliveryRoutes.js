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

router.use(isDeliveryBoy);

router.get('/assigned-orders', deliveryController.getAssignedOrders);
// router.put('/update-status/:id', deliveryController.updateStatus);

router.get('/my-order', deliveryController.getMyCurrentOrder);

router.put('/order/:orderId/status', deliveryController.updateOrderStatus);

module.exports = router;