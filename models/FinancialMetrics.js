const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  category: String,
  date: String,
  amount: Number,
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
    weekly: {
      firstWeek: Number,
      secondWeek: Number,
      thirdWeek: Number,
      fourthWeek: Number,
      fifthWeek: Number,
    },
    monthly: {
      january: Number,
      february: Number,
      march: Number,
      april: Number,
      may: Number,
      june: Number,
      july: Number,
      august: Number,
      september: Number,
      october: Number,
      november: Number,
      december: Number,
    },
    transactions: [transactionSchema],
  },
  expense: {
    this_week: Number,
    this_month: Number,
    this_year: Number,
    total: Number,
    weekly: {
      firstWeek: Number,
      secondWeek: Number,
      thirdWeek: Number,
      fourthWeek: Number,
      fifthWeek: Number,
    },
    monthly: {
      january: Number,
      february: Number,
      march: Number,
      april: Number,
      may: Number,
      june: Number,
      july: Number,
      august: Number,
      september: Number,
      october: Number,
      november: Number,
      december: Number,
    },
    transactions: [transactionSchema],
  },
  savings: {
    this_week: Number,
    this_month: Number,
    this_year: Number,
    total: Number,
    weekly: {
      firstWeek: Number,
      secondWeek: Number,
      thirdWeek: Number,
      fourthWeek: Number,
      fifthWeek: Number,
    },
    monthly: {
      january: Number,
      february: Number,
      march: Number,
      april: Number,
      may: Number,
      june: Number,
      july: Number,
      august: Number,
      september: Number,
      october: Number,
      november: Number,
      december: Number,
    },
  },
  budget: {
    budget_type: String,
    amount: Number,
    percentage_alert: Number,
    description: String,
  },
});

const FinancialMetrics = mongoose.model('FinancialMetrics', financialMetricsSchema, 'financialMetrics');

module.exports = FinancialMetrics;

