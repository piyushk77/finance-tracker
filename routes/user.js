const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const FinancialMetrics = require('../models/FinancialMetrics');
const { calculateExpenseMetrics, calculateIncomeMetrics } = require('../tools/financialMetricsUtils');


// Protected route - requires authentication
router.get('/getMetrics', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Query financial metrics for the specific user
    const userMetrics = await FinancialMetrics.findOne({ userId });

    if (!userMetrics) {
      return res.status(404).json({ message: 'User metrics not found' });
    }

    res.json(userMetrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/setExpense', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { category, date, amount, payment_method, currency, description } = req.body;

    // Find the financial metrics entry for the user
    const financialMetrics = await FinancialMetrics.findOne({ userId });

    if (!financialMetrics) {
      return res.status(404).json({ message: 'Financial metrics not found for the user' });
    }

    // Create a new expense transaction
    const newExpenseTransaction = {
      category,
      date,
      amount,
      payment_method,
      currency,
      description,
    };

    financialMetrics.expense.transactions.push(newExpenseTransaction);

    await financialMetrics.save();

    const expenseMetrics = calculateExpenseMetrics(financialMetrics);

    financialMetrics.expense.this_week = expenseMetrics.thisWeekExpenses;
    financialMetrics.expense.this_month = expenseMetrics.thisMonthExpenses;
    financialMetrics.expense.this_year = expenseMetrics.thisYearExpenses;
    financialMetrics.expense.total = expenseMetrics.totalExpenses;

    await financialMetrics.save();

    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/setIncome', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { category, date, amount, payment_method, currency, description } = req.body;

    // Find the financial metrics entry for the user
    const financialMetrics = await FinancialMetrics.findOne({ userId });

    if (!financialMetrics) {
      return res.status(404).json({ message: 'Financial metrics not found for the user' });
    }

    // Create a new income transaction...
    const newIncomeTransaction = {
      category,
      date,
      amount,
      payment_method,
      currency,
      description,
    };

    financialMetrics.income.transactions.push(newIncomeTransaction);

    await financialMetrics.save();
    
    const incomeMetrics = calculateIncomeMetrics(financialMetrics);

    financialMetrics.income.this_week = incomeMetrics.thisWeekIncome;
    financialMetrics.income.this_month = incomeMetrics.thisMonthIncome;
    financialMetrics.income.this_year = incomeMetrics.thisYearIncome;
    financialMetrics.income.total = incomeMetrics.totalIncome;

    await financialMetrics.save();

    res.status(201).json({ message: 'Income added successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
