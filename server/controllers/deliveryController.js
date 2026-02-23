const Order = require('../models/Order');
const User = require('../models/User');

// FIXED: Added missing function to get all assigned orders for the Tracking component
exports.getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.user._id,
      status: { $in: ['Assigned', 'Shipped'] }
    }).populate('userId', 'name phone address'); // Populating just in case your UI needs it

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the current active order for the logged-in delivery boy
exports.getMyCurrentOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      deliveryBoy: req.user._id, 
      status: { $in: ['Assigned', 'Shipped'] } 
    }).populate('userId', 'name phone address');

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status (Shipped or Delivered)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (status === 'Delivered') {
      // 1. Mark delivery boy as available
      await User.findByIdAndUpdate(req.user._id, { isAvailable: true });

      // 2. AUTO-ASSIGN NEXT ORDER IN QUEUE:
      const unassignedOrder = await Order.findOneAndUpdate(
        { status: 'Pending', deliveryBoy: null },
        { deliveryBoy: req.user._id, status: 'Assigned' },
        { sort: { createdAt: 1 }, new: true } 
      );

      if (unassignedOrder) {
         await User.findByIdAndUpdate(req.user._id, { isAvailable: false });
      }
    }

    res.status(200).json({ message: `Order marked as ${status}`, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};