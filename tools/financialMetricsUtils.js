const { DateTime } = require('luxon');
const moment = require('moment-timezone');

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

      const dateStr = "2023-11-1";
      const timeZone = "UTC";

      // Parse the string and set the time zone
      const dateObject = moment.tz(dateStr, timeZone);

      console.log(dateObject.toISOString());


      // const dateStr = transaction.date;
      // const [year, month, day] = dateStr.split('-');

      // const dateObject = new Date(year, month - 1, day);

      // // Set the time to midnight UTC
      // dateObject.setUTCHours(0, 0, 0, 0);

      // console.log(dateObject);

      const mongoDate = new Date(transaction.date);
      const isoString = mongoDate.toISOString();
      const dateString = isoString.substring(0, 10);
      const luxonDate = DateTime.fromISO(dateString, { zone: 'ist' });
      return luxonDate >= startDate && luxonDate <= endDate;
    })
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
}

module.exports = {
  calculateExpenseMetrics,
  calculateIncomeMetrics,
};