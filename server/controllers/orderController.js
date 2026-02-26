const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

const assignAvailableDeliveryBoy = async (order) => {
  const availableDeliveryBoy = await User.findOneAndUpdate(
    {
      role: 'delivery',
      $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }]
    },
    { isAvailable: false },
    { new: true }
  );

  if (availableDeliveryBoy) {
    order.deliveryBoy = availableDeliveryBoy._id;
    order.status = 'Assigned';
  } else {
    order.deliveryBoy = null;
    order.status = 'Pending';
  }
};

// Place Order
exports.addOrderItems = async (req, res) => {

  try {
    const { items, total, address, name, phone, paymentMethod } = req.body;

    const userId = req.user.id || req.user._id;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      userId: userId,
      items,
      total,
      name,
      address,
      phone,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? false : true
    });

    await assignAvailableDeliveryBoy(order);

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
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
    const { items, total, address, name, phone, userId, tax = 0, deliverycharge = 0 } = req.body;
    const loggedInUserId = req.user?.id || req.user?._id;
    const finalUserId = loggedInUserId || userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    if (!finalUserId) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    // 1. Save the initial order to the database
    const newOrder = new Order({
      userId: finalUserId,
      items,
      total,
      address,
      name,
      phone,
      paymentMethod: 'Stripe',
      paymentStatus: false
    });

    await newOrder.save();

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

    const taxPaise = Math.round(Number(tax || 0) * 100);
    const deliveryPaise = Math.round(Number(deliverycharge || 0) * 100);

    if (taxPaise > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Tax' },
          unit_amount: taxPaise
        },
        quantity: 1
      });
    }

    if (deliveryPaise > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Delivery Charges' },
          unit_amount: deliveryPaise
        },
        quantity: 1
      });
    }

    // Ensure Stripe payable amount exactly matches frontend "total" (tax-inclusive)
    const expectedTotalPaise = Math.round(Number(total) * 100);
    const lineItemsTotalPaise = line_items.reduce(
      (sum, li) => sum + (li.price_data.unit_amount * li.quantity),
      0
    );
    const adjustmentPaise = expectedTotalPaise - lineItemsTotalPaise;

    if (adjustmentPaise > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Tax/Fees Adjustment' },
          unit_amount: adjustmentPaise
        },
        quantity: 1
      });
    } else if (adjustmentPaise < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total: total is less than computed line-item amount'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL}/verify?success=false&orderId=${newOrder._id}`
    });

    // 4. Send the session URL back to the frontend
    return res.status(201).json({ success: true, session_url: session.url, orderId: newOrder._id });
  } catch (error) {
    console.error("Stripe Error:", error);
   return res.status(500).json({ success: false, message: "Error placing order", error: error.message });
  }
}

// Verify payment status after Stripe redirects back
exports.verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== (req.user.id || req.user._id).toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to verify this order" });
    }

    if (success === "true") {
      order.paymentStatus = true;

      // Assign a delivery boy only after successful payment
      if (!order.deliveryBoy) {
        await assignAvailableDeliveryBoy(order);
      }

      await order.save();
      return res.json({ success: true, message: "Paid Successfully" });
    } else {
      // If somehow assigned before cancellation, release that delivery boy
      if (order.deliveryBoy) {
        await User.findByIdAndUpdate(order.deliveryBoy, { isAvailable: true });
      }
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment Failed or Cancelled" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
}

exports.addOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { items, total, address, name, phone, paymentMethod } = req.body;

    // 1. Create order with default 'Pending' status
    const newOrder = new Order({
      userId,
      items,
      total,
      address,
      name,
      phone,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: false
    });

    await assignAvailableDeliveryBoy(newOrder);

    await newOrder.save();

    res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });

  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
