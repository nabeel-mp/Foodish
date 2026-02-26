const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Expense = require('../models/Expense');
const WagePayment = require('../models/WagePayment');
const bcrypt = require('bcryptjs');
const DELIVERY_WAGE_PER_ORDER = 25;

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) 
          },
          status: { $ne: 'Cancelled' },
          $or: [
            { paymentMethod: { $ne: 'Stripe' } },
            { paymentStatus: true }
          ]
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          products: totalProducts,
          orders: totalOrders,
          revenue: totalRevenue
        },
        charts: {
          monthlyRevenue,
          ordersByStatus
        }
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        orders
      }
    });

  } catch (error) {
    console.error("Get User Details Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle status
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    res.status(200).json({ 
      message: `User ${user.status} successfully`, 
      user: { id: user._id, name: user.name, email: user.email, status: user.status } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.createDeliveryBoy = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user explicitly with the 'delivery' role
    const deliveryBoy = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'delivery',
      isAvailable: true // Available by default when created
    });

    await deliveryBoy.save();

    // Remove password from response
    deliveryBoy.password = undefined; 
    res.status(201).json({ message: "Delivery Personnel created successfully", deliveryBoy });
  } catch (error) {
    res.status(500).json({ message: "Error creating delivery boy", error: error.message });
  }
};

// Get all Delivery Boys and their status
exports.getDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: 'delivery' }).select('-password').sort({ createdAt: -1 });

    const deliveredStats = await Order.aggregate([
      { $match: { status: 'Delivered', deliveryBoy: { $ne: null } } },
      { $group: { _id: '$deliveryBoy', deliveredCount: { $sum: 1 } } }
    ]);

    const deliveredMap = new Map(
      deliveredStats.map((item) => [String(item._id), item.deliveredCount])
    );

    const data = deliveryBoys.map((boy) => {
      const deliveredCount = deliveredMap.get(String(boy._id)) || 0;
      return {
        ...boy.toObject(),
        deliveredCount,
        wagePerDelivery: DELIVERY_WAGE_PER_ORDER,
        wages: deliveredCount * DELIVERY_WAGE_PER_ORDER
      };
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching delivery personnel", error: error.message });
  }
};

exports.deleteDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoy = await User.findById(req.params.id);

    if (!deliveryBoy || deliveryBoy.role !== 'delivery') {
      return res.status(404).json({ success: false, message: "Delivery personnel not found" });
    }

    const activeOrders = await Order.countDocuments({
      deliveryBoy: deliveryBoy._id,
      status: { $in: ['Assigned', 'Shipped'] }
    });

    if (activeOrders > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete: delivery personnel has active assigned orders"
      });
    }

    await deliveryBoy.deleteOne();
    return res.status(200).json({ success: true, message: "Delivery personnel deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting delivery personnel", error: error.message });
  }
};

exports.getDeliveryBoyDetails = async (req, res) => {
  try {
    const deliveryBoy = await User.findById(req.params.id).select('-password');

    if (!deliveryBoy || deliveryBoy.role !== 'delivery') {
      return res.status(404).json({ success: false, message: "Delivery personnel not found" });
    }

    const orders = await Order.find({ deliveryBoy: deliveryBoy._id })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    const deliveredCount = orders.filter((order) => order.status === 'Delivered').length;
    const activeCount = orders.filter((order) => ['Assigned', 'Shipped'].includes(order.status)).length;

    return res.status(200).json({
      success: true,
      data: {
        deliveryBoy,
        deliveredCount,
        activeCount,
        wagePerDelivery: DELIVERY_WAGE_PER_ORDER,
        totalWages: deliveredCount * DELIVERY_WAGE_PER_ORDER,
        orders
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching delivery personnel details", error: error.message });
  }
};

exports.getAccountsSummary = async (req, res) => {
  try {
    const revenueAgg = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' },
          $or: [
            { paymentMethod: { $ne: 'Stripe' } },
            { paymentStatus: true }
          ]
        }
      },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const deliveredOrdersCount = await Order.countDocuments({ status: 'Delivered' });
    const accruedDeliveryWages = deliveredOrdersCount * DELIVERY_WAGE_PER_ORDER;

    const paidWagesAgg = await WagePayment.aggregate([
      { $group: { _id: null, totalPaid: { $sum: '$amount' } } }
    ]);
    const paidDeliveryWages = paidWagesAgg[0]?.totalPaid || 0;
    const deliveryWagesPayable = Math.max(0, accruedDeliveryWages - paidDeliveryWages);

    const manualExpenseAgg = await Expense.aggregate([
      { $group: { _id: null, totalManualExpenses: { $sum: '$amount' } } }
    ]);
    const totalManualExpenses = manualExpenseAgg[0]?.totalManualExpenses || 0;

    const categoryBreakdown = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const totalExpenses = paidDeliveryWages + totalManualExpenses;
    const profitOrLoss = totalRevenue - totalExpenses;

    return res.status(200).json({
      success: true,
      data: {
        revenue: totalRevenue,
        deliveryWagePerOrder: DELIVERY_WAGE_PER_ORDER,
        deliveredOrdersCount,
        accruedDeliveryWages,
        paidDeliveryWages,
        deliveryWagesPayable,
        manualExpenses: totalManualExpenses,
        totalExpenses,
        profitOrLoss,
        categoryBreakdown
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch accounts summary', error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({})
      .populate('createdBy', 'name email')
      .sort({ expenseDate: -1, createdAt: -1 });

    return res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch expenses', error: error.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { title, category, amount, notes, expenseDate } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Title and amount are required' });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a valid non-negative number' });
    }

    const expense = await Expense.create({
      title: title.trim(),
      category: category || 'other',
      amount: parsedAmount,
      notes: notes || '',
      expenseDate: expenseDate || new Date(),
      createdBy: req.user._id
    });

    return res.status(201).json({ success: true, data: expense });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create expense', error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await expense.deleteOne();
    return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete expense', error: error.message });
  }
};

exports.getDeliveryWageLedger = async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: 'delivery' }).select('name email phone').sort({ createdAt: -1 });

    const deliveredAgg = await Order.aggregate([
      { $match: { status: 'Delivered', deliveryBoy: { $ne: null } } },
      { $group: { _id: '$deliveryBoy', deliveredCount: { $sum: 1 } } }
    ]);

    const paidAgg = await WagePayment.aggregate([
      { $group: { _id: '$deliveryBoy', paidAmount: { $sum: '$amount' } } }
    ]);

    const deliveredMap = new Map(deliveredAgg.map((item) => [String(item._id), item.deliveredCount]));
    const paidMap = new Map(paidAgg.map((item) => [String(item._id), item.paidAmount]));

    const ledger = deliveryBoys.map((boy) => {
      const deliveredCount = deliveredMap.get(String(boy._id)) || 0;
      const accrued = deliveredCount * DELIVERY_WAGE_PER_ORDER;
      const paid = paidMap.get(String(boy._id)) || 0;
      const payable = Math.max(0, accrued - paid);

      return {
        deliveryBoyId: boy._id,
        name: boy.name,
        email: boy.email,
        phone: boy.phone,
        deliveredCount,
        wagePerDelivery: DELIVERY_WAGE_PER_ORDER,
        accrued,
        paid,
        payable
      };
    });

    return res.status(200).json({ success: true, data: ledger });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch wage ledger', error: error.message });
  }
};

exports.createDeliveryWagePayment = async (req, res) => {
  try {
    const { deliveryBoyId, amount, notes, paidAt } = req.body;

    const deliveryBoy = await User.findById(deliveryBoyId);
    if (!deliveryBoy || deliveryBoy.role !== 'delivery') {
      return res.status(404).json({ success: false, message: 'Delivery personnel not found' });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
    }

    const deliveredCount = await Order.countDocuments({ deliveryBoy: deliveryBoy._id, status: 'Delivered' });
    const accrued = deliveredCount * DELIVERY_WAGE_PER_ORDER;

    const paidAgg = await WagePayment.aggregate([
      { $match: { deliveryBoy: deliveryBoy._id } },
      { $group: { _id: null, totalPaid: { $sum: '$amount' } } }
    ]);
    const totalPaid = paidAgg[0]?.totalPaid || 0;
    const payable = Math.max(0, accrued - totalPaid);

    if (parsedAmount > payable) {
      return res.status(400).json({ success: false, message: `Amount exceeds payable wage. Max payable: ${payable}` });
    }

    const payment = await WagePayment.create({
      deliveryBoy: deliveryBoy._id,
      amount: parsedAmount,
      notes: notes || '',
      paidAt: paidAt || new Date(),
      createdBy: req.user._id
    });

    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to record wage payment', error: error.message });
  }
};
