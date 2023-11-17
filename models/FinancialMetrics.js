const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: String,
  category: String,
  date: Date,
  income: Number,
  expense: Number,
  payment_method: String,
  currency: String,
  description: String,
});

const financialMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  email: String,
  income: {
    this_week: Number,
    this_month: Number,
    this_year: Number,
    total: Number,
    transactions: [transactionSchema],
  },
  expense: {
    this_week: Number,
    this_month: Number,
    this_year: Number,
    total: Number,
    transactions: [transactionSchema],
  },
  savings: {
    this_week: Number,
    this_month: Number,
    this_year: Number,
    total: Number,
  },
  budget: {
    type: String,
    amount: Number,
    description: String,
  },
});

const FinancialMetrics = mongoose.model('FinancialMetrics', financialMetricsSchema, 'financialMetrics');

module.exports = FinancialMetrics;

