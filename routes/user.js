const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const FinancialMetrics = require('../models/FinancialMetrics');
const { calculateExpenseMetrics, calculateIncomeMetrics, calculateSavings } = require('../tools/financialMetricsUtils');


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

    // Preprocess the date

    const formattedDate = convertDateFormat(date);

    // Find the financial metrics entry for the user
    const financialMetrics = await FinancialMetrics.findOne({ userId });

    if (!financialMetrics) {
      return res.status(404).json({ message: 'Financial metrics not found for the user' });
    }

    // Create a new expense transaction
    const newExpenseTransaction = {
      category,
      date: formattedDate,
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
    financialMetrics.savings.this_week = expenseMetrics.thisWeekSavings;
    financialMetrics.savings.this_month = expenseMetrics.thisMonthSavings;
    financialMetrics.savings.this_year = expenseMetrics.thisYearSavings;
    financialMetrics.savings.total = expenseMetrics.totalSavings;

    // Update weekly and monthly values
    expenseMetrics.weeklyExpenses.then((resolvedValue) => {
      financialMetrics.expense.weekly = { ...resolvedValue };
    });

    expenseMetrics.monthlyExpenses.then((resolvedValue) => {
      financialMetrics.expense.monthly = { ...resolvedValue };
    });

    await financialMetrics.save();

    const savings = calculateSavings(financialMetrics);

    financialMetrics.savings.weekly = { ...savings.weekly };
    financialMetrics.savings.monthly = { ...savings.monthly };

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

    // Preprocess the date

    const formattedDate = convertDateFormat(date);

    // Find the financial metrics entry for the user
    const financialMetrics = await FinancialMetrics.findOne({ userId });

    if (!financialMetrics) {
      return res.status(404).json({ message: 'Financial metrics not found for the user' });
    }

    // Create a new income transaction...
    const newIncomeTransaction = {
      category,
      date: formattedDate,
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
    financialMetrics.savings.this_week = incomeMetrics.thisWeekSavings;
    financialMetrics.savings.this_month = incomeMetrics.thisMonthSavings;
    financialMetrics.savings.this_year = incomeMetrics.thisYearSavings;
    financialMetrics.savings.total = incomeMetrics.totalSavings;

    // Update weekly and monthly values
    incomeMetrics.weeklyIncome.then((resolvedValue) => {
      financialMetrics.income.weekly = { ...resolvedValue };
    });

    incomeMetrics.monthlyIncome.then((resolvedValue) => {
      financialMetrics.income.monthly = { ...resolvedValue };
    });

    await financialMetrics.save();

    const savings = calculateSavings(financialMetrics);

    financialMetrics.savings.weekly = { ...savings.weekly };
    financialMetrics.savings.monthly = { ...savings.monthly };

    await financialMetrics.save();

    res.status(201).json({ message: 'Income added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/setBudget', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { budget_type, amount, percentage_alert, description, } = req.body;

    // Find the financial metrics entry for the user
    const financialMetrics = await FinancialMetrics.findOne({ userId });

    if (!financialMetrics) {
      return res.status(404).json({ message: 'Financial metrics not found for the user' });
    }

    // Create a new income transaction...
    const budget = {
      budget_type, 
      amount, 
      percentage_alert, 
      description,
    };

    financialMetrics.budget = { ...budget };

    await financialMetrics.save();

    res.status(201).json({ message: 'Budget added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function convertDateFormat(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits for month
  const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits for day
  return `${year}-${month}-${day}`;
}

module.exports = router;
