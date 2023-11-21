const { DateTime } = require('luxon');

function calculateExpenseMetrics(financialMetrics) {
  const currentDate = DateTime.local().setZone('Asia/Kolkata');
  const currentWeekStart = currentDate.startOf('week');
  const currentMonthStart = currentDate.startOf('month');
  const currentYearStart = currentDate.startOf('year');

  const thisWeekExpenses = calculateAmountInRange(financialMetrics.expense.transactions, currentWeekStart, currentDate);
  const thisMonthExpenses = calculateAmountInRange(financialMetrics.expense.transactions, currentMonthStart, currentDate);
  const thisYearExpenses = calculateAmountInRange(financialMetrics.expense.transactions, currentYearStart, currentDate);
  const totalExpenses = financialMetrics.expense.transactions.reduce((total, transaction) => total + transaction.amount, 0);

  const thisWeekSavings = financialMetrics.income.this_week - thisWeekExpenses;
  const thisMonthSavings = financialMetrics.income.this_month - thisMonthExpenses;
  const thisYearSavings = financialMetrics.income.this_year - thisYearExpenses;
  const totalSavings = financialMetrics.income.total - totalExpenses;

  const weeklyExpenses = calculateWeeklyAmount(financialMetrics.expense.transactions, currentMonthStart, currentDate);

  const monthlyExpenses = calculateMonthlyAmount(financialMetrics.expense.transactions, currentYearStart, currentDate);

  return {
    thisWeekExpenses,
    thisMonthExpenses,
    thisYearExpenses,
    totalExpenses,
    thisWeekSavings,
    thisMonthSavings,
    thisYearSavings,
    totalSavings,
    weeklyExpenses,
    monthlyExpenses,
  };
}

function calculateIncomeMetrics(financialMetrics) {

  const currentDate = DateTime.local().setZone('Asia/Kolkata');
  const currentWeekStart = currentDate.startOf('week');
  const currentMonthStart = currentDate.startOf('month');
  const currentYearStart = currentDate.startOf('year');

  const thisWeekIncome = calculateAmountInRange(financialMetrics.income.transactions, currentWeekStart, currentDate);
  const thisMonthIncome = calculateAmountInRange(financialMetrics.income.transactions, currentMonthStart, currentDate);
  const thisYearIncome = calculateAmountInRange(financialMetrics.income.transactions, currentYearStart, currentDate);
  const totalIncome = financialMetrics.income.transactions.reduce((total, transaction) => total + transaction.amount, 0);

  const thisWeekSavings = thisWeekIncome - financialMetrics.expense.this_week;
  const thisMonthSavings = thisMonthIncome - financialMetrics.expense.this_month;
  const thisYearSavings = thisYearIncome - financialMetrics.expense.this_year;
  const totalSavings = totalIncome - financialMetrics.expense.total;


  const weeklyIncome = calculateWeeklyAmount(financialMetrics.income.transactions, currentMonthStart, currentDate);

  const monthlyIncome = calculateMonthlyAmount(financialMetrics.income.transactions, currentYearStart, currentDate);


  return {
    thisWeekIncome,
    thisMonthIncome,
    thisYearIncome,
    totalIncome,
    thisWeekSavings,
    thisMonthSavings,
    thisYearSavings,
    totalSavings,
    weeklyIncome,
    monthlyIncome,
  };
}

function calculateSavings(financialMetrics) {
  const savings = {
    weekly: {
      firstWeek: 0,
      secondWeek: 0,
      thirdWeek: 0,
      fourthWeek: 0,
      fifthWeek: 0,
    },
    monthly: {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    },
  }

  // Calculating weekly savings.
  savings.weekly.firstWeek = financialMetrics.income.weekly.firstWeek - financialMetrics.expense.weekly.firstWeek;
  savings.weekly.secondWeek = financialMetrics.income.weekly.secondWeek - financialMetrics.expense.weekly.secondWeek;
  savings.weekly.thirdWeek = financialMetrics.income.weekly.thirdWeek - financialMetrics.expense.weekly.thirdWeek;
  savings.weekly.fourthWeek = financialMetrics.income.weekly.fourthWeek - financialMetrics.expense.weekly.fourthWeek;
  savings.weekly.fifthWeek = financialMetrics.income.weekly.fifthWeek - financialMetrics.expense.weekly.fifthWeek;

  // Calculating monthly savings.
  savings.monthly.january = financialMetrics.income.monthly.january - financialMetrics.expense.monthly.january;
  savings.monthly.february = financialMetrics.income.monthly.february - financialMetrics.expense.monthly.february;
  savings.monthly.march = financialMetrics.income.monthly.march - financialMetrics.expense.monthly.march;
  savings.monthly.april = financialMetrics.income.monthly.april - financialMetrics.expense.monthly.april;
  savings.monthly.may = financialMetrics.income.monthly.may - financialMetrics.expense.monthly.may;
  savings.monthly.june = financialMetrics.income.monthly.june - financialMetrics.expense.monthly.june;
  savings.monthly.july = financialMetrics.income.monthly.july - financialMetrics.expense.monthly.july;
  savings.monthly.august = financialMetrics.income.monthly.august - financialMetrics.expense.monthly.august;
  savings.monthly.september = financialMetrics.income.monthly.september - financialMetrics.expense.monthly.september;
  savings.monthly.october = financialMetrics.income.monthly.october - financialMetrics.expense.monthly.october;
  savings.monthly.november = financialMetrics.income.monthly.november - financialMetrics.expense.monthly.november;
  savings.monthly.december = financialMetrics.income.monthly.december - financialMetrics.expense.monthly.december;

  return savings;

}

function calculateAmountInRange(transactions, startDate, endDate) {
  return transactions
    .filter(transaction => {
      const inputDate = DateTime.fromFormat(transaction.date, "yyyy-MM-d");
      // Convert to IST
      const istDate = inputDate.setZone('Asia/Kolkata');
      return istDate >= startDate && istDate <= endDate;
    })
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
}

const calculateWeeklyAmount = async (Transactions, startDate, endDate) => {
  const transactions = Transactions
    .filter(transaction => {
      const inputDate = DateTime.fromFormat(transaction.date, "yyyy-MM-d");
      // Convert to IST
      const istDate = inputDate.setZone('Asia/Kolkata');
      return (istDate >= startDate && istDate <= endDate);
    });

  const weeklyAmount = {
    firstWeek: 0,
    secondWeek: 0,
    thirdWeek: 0,
    fourthWeek: 0,
    fifthWeek: 0,
  };

  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    const formattedStartDate = new Date(startDate);
    const week = Math.ceil((transactionDate.getDate() + formattedStartDate.getDay()) / 7);

    // Check if the amount is a valid number
    const transactionAmount = Number(transaction.amount);
    if (!isNaN(transactionAmount)) {
      // Update the corresponding week field
      switch (week) {
        case 1:
          weeklyAmount.firstWeek += transactionAmount;
          break;
        case 2:
          weeklyAmount.secondWeek += transactionAmount;
          break;
        case 3:
          weeklyAmount.thirdWeek += transactionAmount;
          break;
        case 4:
          weeklyAmount.fourthWeek += transactionAmount;
          break;
        case 5:
          weeklyAmount.fifthWeek += transactionAmount;
          break;
        default:
          break;
      }
    }
  });

  return weeklyAmount;
};

const calculateMonthlyAmount = async (Transactions, startDate, endDate) => {
  const transactions = Transactions
    .filter(transaction => {
      const inputDate = DateTime.fromFormat(transaction.date, "yyyy-MM-d");
      // Convert to IST
      const istDate = inputDate.setZone('Asia/Kolkata');
      return (istDate >= startDate && istDate <= endDate);
    });

  const monthlyAmount = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
  };

  transactions.forEach(transaction => {
    const month = new Date(transaction.date).getMonth();
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2023, month));
    monthlyAmount[monthName.toLowerCase()] += transaction.amount;
  });

  return monthlyAmount;
};


module.exports = {
  calculateExpenseMetrics,
  calculateIncomeMetrics,
  calculateSavings,
};