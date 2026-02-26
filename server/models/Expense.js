const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['chef_salary', 'groceries', 'vegetables', 'fruits', 'utilities', 'rent', 'other'],
      default: 'other'
    },
    amount: { type: Number, required: true, min: 0 },
    notes: { type: String, default: '' },
    expenseDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
