function calculateExpenseMetrics(financialMetrics) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const thisWeekExpenses = calculateAmountInRange(financialMetrics.expense.transactions, currentWeekStart, currentDate);
    const thisMonthExpenses = calculateAmountInRange(financialMetrics.expense.transactions, new Date(currentYear, currentMonth, 1), currentDate);
    const thisYearExpenses = calculateAmountInRange(financialMetrics.expense.transactions, new Date(currentYear, 0, 1), currentDate);
    const totalExpenses = financialMetrics.expense.total;
  
    return {
      thisWeekExpenses,
      thisMonthExpenses,
      thisYearExpenses,
      totalExpenses,
    };
  }
  
  function calculateIncomeMetrics(financialMetrics) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Assuming Sunday is the first day of the week
  
    const thisWeekIncome = calculateAmountInRange(financialMetrics.income.transactions, currentWeekStart, currentDate);
    const thisMonthIncome = calculateAmountInRange(financialMetrics.income.transactions, new Date(currentYear, currentMonth, 1), currentDate);
    const thisYearIncome = calculateAmountInRange(financialMetrics.income.transactions, new Date(currentYear, 0, 1), currentDate);
    const totalIncome = financialMetrics.income.total;
  
    return {
      thisWeekIncome,
      thisMonthIncome,
      thisYearIncome,
      totalIncome,
    };
  }
  
  function calculateAmountInRange(transactions, startDate, endDate) {
    return transactions
      .filter(transaction => transaction.date >= startDate && transaction.date <= endDate)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }
  
  module.exports = {
    calculateExpenseMetrics,
    calculateIncomeMetrics,
  };