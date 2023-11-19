const { DateTime } = require('luxon');

function calculateExpenseMetrics(financialMetrics) {
  const currentDate = DateTime.local().setZone('ist');
  const currentYear = currentDate.year;
  const currentMonth = currentDate.month;
  const currentWeekStart = currentDate.startOf('week');
  const thisWeekExpenses = calculateAmountInRange(financialMetrics.expense.transactions, currentWeekStart.toJSDate(), currentDate.toJSDate());

  const thisMonthExpenses = calculateAmountInRange(financialMetrics.expense.transactions, DateTime.local(currentYear, currentMonth, 1).toJSDate(), currentDate.toJSDate());
  const thisYearExpenses = calculateAmountInRange(financialMetrics.expense.transactions, DateTime.local(currentYear, 1, 1).toJSDate(), currentDate.toJSDate());
  const totalExpenses = financialMetrics.expense.transactions.reduce((total, transaction) => total + transaction.amount, 0);

  const thisWeekSavings = financialMetrics.income.this_week - thisWeekExpenses;
  const thisMonthSavings = financialMetrics.income.this_month - thisMonthExpenses;
  const thisYearSavings = financialMetrics.income.this_year - thisYearExpenses;
  const totalSavings = financialMetrics.income.total - totalExpenses;

  return {
    thisWeekExpenses,
    thisMonthExpenses,
    thisYearExpenses,
    totalExpenses,
    thisWeekSavings,
    thisMonthSavings,
    thisYearSavings,
    totalSavings,
  };
}

function calculateIncomeMetrics(financialMetrics) {

  const currentDate = DateTime.local().setZone('ist');
  const currentWeekStart = currentDate.startOf('week');

  const thisWeekIncome = calculateAmountInRange(financialMetrics.income.transactions, currentWeekStart, currentDate);
  const thisMonthIncome = calculateAmountInRange(financialMetrics.income.transactions, currentDate.startOf('month'), currentDate);
  const thisYearIncome = calculateAmountInRange(financialMetrics.income.transactions, currentDate.startOf('year'), currentDate);
  const totalIncome = financialMetrics.income.transactions.reduce((total, transaction) => total + transaction.amount, 0);

  const thisWeekSavings = thisWeekIncome - financialMetrics.expense.this_week;
  const thisMonthSavings = thisMonthIncome - financialMetrics.expense.this_month;
  const thisYearSavings = thisYearIncome - financialMetrics.expense.this_year;
  const totalSavings = totalIncome - financialMetrics.expense.total;

  return {
    thisWeekIncome,
    thisMonthIncome,
    thisYearIncome,
    totalIncome,
    thisWeekSavings,
    thisMonthSavings,
    thisYearSavings,
    totalSavings,
  };
}

function calculateAmountInRange(transactions, startDate, endDate) {

  return transactions
    .filter(transaction => {
      const inputDate = DateTime.fromFormat(transaction.date, "yyyy-MM-dd");
      // Convert to IST
      const istDate = inputDate.setZone('Asia/Kolkata');
      return istDate >= startDate && istDate <= endDate;
    })
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
}

module.exports = {
  calculateExpenseMetrics,
  calculateIncomeMetrics,
};