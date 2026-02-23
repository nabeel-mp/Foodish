const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

// Place Order
exports.addOrderItems = async (req, res) => {

  try {
    const { items, total, address, name, phone, paymentMethod } = req.body;

    const userId = req.user.id || req.user._id;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const availableDeliveryBoy = await User.findOne({
      role: 'delivery',
      $or: [
        { isAvailable: true },
        { isAvailable: { $exists: false } }
      ]
    });

    const order = new Order({
      userId: req.user._id,
      items,
      totalAmount: total,
      name,
      deliveryAddress: address,
      phone,
      paymentMethod,
      payment: false,
      status: availableDeliveryBoy ? "Assigned" : "Pending",
      deliveryBoy: availableDeliveryBoy ? availableDeliveryBoy._id : null
    });

    if (availableDeliveryBoy) {
      availableDeliveryBoy.isAvailable = false;
      await availableDeliveryBoy.save();
    }

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch {
    console.error("Order Placement Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

exports.placeOrderStripe = async (req, res) => {
  try {
    const { items, total, address, name, phone, userId } = req.body;

    // 1. Save the initial order to the database (paymentStatus: false)
    const newOrder = new Order({
      user: req.user ? req.user_id : userId,
      userId: userId,
      items,
      total,
      address,
      name,
      phone,
      paymentMethod: 'Stripe',
      paymentStatus: false
    });
    const availableDeliveryBoy = await User.findOneAndUpdate(
      { role: 'delivery', isAvailable: true },
      { isAvailable: false }, // Instantly mark them as busy
      { new: true }
    );

    if (availableDeliveryBoy) {
      newOrder.deliveryBoy = availableDeliveryBoy._id;
      newOrder.status = 'Assigned';
    }

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });

    // 2. Format the cart items for Stripe's 'line_items' array
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'inr', // Change to 'usd' or your preferred currency
        product_data: {
          name: item.name || item.title || 'Food Item',
        },
        unit_amount: Math.round(item.price * 100),// Stripe requires the amount in subunits (e.g., paise/cents)
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Delivery Charges' },
        unit_amount: 25 * 100 // Example: 50 INR
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL}/verify?success=false&orderId=${newOrder._id}`
    });

    // 4. Send the session URL back to the frontend
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
}

// Verify payment status after Stripe redirects back
exports.verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      // Update order to paid
      await Order.findByIdAndUpdate(orderId, { paymentStatus: true });
      res.json({ success: true, message: "Paid Successfully" });
    } else {
      // Delete order if payment failed/cancelled
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Failed or Cancelled" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
}

exports.addOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, deliveryAddress } = req.body;

    // 1. Create order with default 'Pending' status
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      status: "Pending",
      payment: false,
    });

    // 2. AUTOMATIC ASSIGNMENT: Find a delivery boy who is currently available
    // Note: Change 'DeliveryBoy' to match whatever string you use for roles
    const availableDeliveryBoy = await User.findOne({
      role: 'DeliveryBoy',
      isAvailable: true
    });

    // 3. If an available delivery boy exists, assign them immediately
    if (availableDeliveryBoy) {
      newOrder.deliveryBoy = availableDeliveryBoy._id;
      newOrder.status = "Assigned";

      // Mark the delivery boy as unavailable so they don't get multiple overlapping orders
      availableDeliveryBoy.isAvailable = false;
      await availableDeliveryBoy.save();
    }

    await newOrder.save();

    res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });

  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};