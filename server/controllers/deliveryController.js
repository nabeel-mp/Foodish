const Order = require('../models/Order');
const User = require('../models/User');
const WAGE_PER_DELIVERY = 25;

exports.getAssignedOrders = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id || req.user._id;
    if (!deliveryBoyId) {
      return res.status(400).json({ success: false, message: "Delivery boy ID not found in token" });
    }

    const orders = await Order.find({
      deliveryBoy: deliveryBoyId,
      status: { $in: ['Assigned', 'Shipped'] }
    })
      .populate('userId', 'name phone')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, orders });
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
    })
      .populate('userId', 'name phone')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Shipped or Delivered)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const deliveryBoyId = req.user.id || req.user._id;
    const allowedStatuses = ['Shipped', 'Delivered'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status update" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!order.deliveryBoy || order.deliveryBoy.toString() !== deliveryBoyId.toString()) {
      return res.status(403).json({ success: false, message: "You are not assigned to this order" });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ success: false, message: "Order is already delivered" });
    }

    if (status === 'Delivered' && order.status !== 'Shipped') {
      return res.status(400).json({ success: false, message: "Order must be shipped before delivery" });
    }

    order.status = status;
    await order.save();

    if (status === 'Shipped') {
      // Driver must remain busy while actively delivering.
      await User.findByIdAndUpdate(deliveryBoyId, { isAvailable: false });
    }

    if (status === 'Delivered') {
      // Driver becomes available only after completing current delivery.
      await User.findByIdAndUpdate(deliveryBoyId, { isAvailable: true });
    }

    res.status(200).json({ success: true, message: `Order marked as ${status}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id || req.user._id;
    const orders = await Order.find({
      deliveryBoy: deliveryBoyId,
      status: 'Delivered'
    })
      .populate('userId', 'name phone')
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalarySummary = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id || req.user._id;

    const totalDelivered = await Order.countDocuments({
      deliveryBoy: deliveryBoyId,
      status: 'Delivered'
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthDelivered = await Order.countDocuments({
      deliveryBoy: deliveryBoyId,
      status: 'Delivered',
      updatedAt: { $gte: monthStart }
    });

    return res.status(200).json({
      success: true,
      data: {
        wagePerDelivery: WAGE_PER_DELIVERY,
        totalDelivered,
        totalSalary: totalDelivered * WAGE_PER_DELIVERY,
        monthDelivered,
        monthSalary: monthDelivered * WAGE_PER_DELIVERY
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
