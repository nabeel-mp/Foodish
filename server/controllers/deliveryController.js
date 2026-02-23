const Order = require('../models/Order');
const User = require('../models/User');

exports.getAssignedOrders = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id || req.user._id;
    if (!deliveryBoyId) {
      return res.status(400).json({ success: false, message: "Delivery boy ID not found in token" });
    }

    const orders = await Order.find({
      deliveryBoy: deliveryBoyId,
      status: { $in: ['Assigned', 'Shipped'] }
    }).populate('userId', 'name phone address');

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
    const deliveryBoyId = req.user.id || req.user._id;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    if (status === 'Delivered') {
      const nextPendingOrder = await Order.findOne({ status: 'Pending' }).sort({ createdAt: 1 });
      if (nextPendingOrder) {
        // 2. If there is a pending order, assign it to this driver instantly!
        nextPendingOrder.deliveryBoy = deliveryBoyId;
        nextPendingOrder.status = "Assigned";
        await nextPendingOrder.save();

      } else {
        await User.findByIdAndUpdate(deliveryBoyId, { isAvailable: true });
      }
    }

    res.status(200).json({ message: `Order marked as ${status}`, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};