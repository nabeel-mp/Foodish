const mongoose = require('mongoose');

const wagePaymentSchema = new mongoose.Schema(
  {
    deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    notes: { type: String, default: '' },
    paidAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WagePayment', wagePaymentSchema);
