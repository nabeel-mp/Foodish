const Order = require('../models/Order');
const User = require('../models/User');

const getEligibleDeliveryBoys = async () => {
  return User.find({
    role: 'delivery',
    status: 'active',
    isPresent: { $ne: false },
    isAvailable: { $ne: false }
  }).sort({ createdAt: 1 });
};

const assignAvailableDeliveryBoyToOrder = async (order) => {
  if (order.paymentMethod === 'Stripe' && !order.paymentStatus) {
    order.deliveryBoy = null;
    order.status = 'Pending';
    return null;
  }

  const deliveryBoys = await getEligibleDeliveryBoys();
  if (!deliveryBoys.length) {
    order.deliveryBoy = null;
    order.status = 'Pending';
    return null;
  }

  const boyIds = deliveryBoys.map((boy) => boy._id);
  const activeCounts = await Order.aggregate([
    {
      $match: {
        deliveryBoy: { $in: boyIds },
        status: { $in: ['Assigned', 'Shipped'] }
      }
    },
    { $group: { _id: '$deliveryBoy', count: { $sum: 1 } } }
  ]);

  const countMap = new Map(activeCounts.map((item) => [String(item._id), item.count]));
  const selectedBoy = deliveryBoys.reduce((best, current) => {
    if (!best) return current;
    const bestCount = countMap.get(String(best._id)) || 0;
    const currentCount = countMap.get(String(current._id)) || 0;
    return currentCount < bestCount ? current : best;
  }, null);

  if (!selectedBoy) {
    order.deliveryBoy = null;
    order.status = 'Pending';
    return null;
  }

  order.deliveryBoy = selectedBoy._id;
  order.status = 'Assigned';
  return selectedBoy;
};

const assignPendingOrdersToAvailableDeliveryBoys = async () => {
  const pendingOrders = await Order.find({
    status: 'Pending',
    $or: [{ deliveryBoy: null }, { deliveryBoy: { $exists: false } }],
    $and: [
      {
        $or: [
          { paymentMethod: { $ne: 'Stripe' } },
          { paymentStatus: true }
        ]
      }
    ]
  }).sort({ createdAt: 1 });

  let assignedCount = 0;
  for (const order of pendingOrders) {
    const selected = await assignAvailableDeliveryBoyToOrder(order);
    if (!selected) {
      break;
    }
    await order.save();
    assignedCount += 1;
  }

  return assignedCount;
};

module.exports = {
  assignAvailableDeliveryBoyToOrder,
  assignPendingOrdersToAvailableDeliveryBoys
};
