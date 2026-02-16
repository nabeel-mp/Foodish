const Order = require('../models/Order');

// Place Order
exports.addOrderItems = async (req, res) => {
  const { items, total, address, name, phone, paymentMethod } = req.body;

  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = new Order({
    userId: req.user._id,
    items,
    total,
    name,
    address,
    phone,
    paymentMethod
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

// Get Logged In User Orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'id name email');
  res.json(orders);
};