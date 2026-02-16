const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    }
  ],
  total: { type: Number, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  status: { type: String, default: 'Order Placed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);