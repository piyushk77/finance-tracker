const mongoose = require('mongoose');

const financialMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Add other financial metrics fields as needed
  income: Number,
  expenses: Number,
  // ... other fields
});

const FinancialMetrics = mongoose.model('FinancialMetrics', financialMetricsSchema, 'financialMetrics');

module.exports = FinancialMetrics;
