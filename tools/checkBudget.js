const { sendEmail } = require('./notification');

function checkBudget(financialMetrics) {
    const budget_type = financialMetrics.budget.budget_type;
    const percentage_alert = financialMetrics.budget.percentage_alert;
    const budget = financialMetrics.budget.amount;
    if(!budget){
        return;
    }
    const amount_alert = percentage_alert * budget / 100;
    const sendTo = financialMetrics.email;
    const user = financialMetrics.username;

    let subject = "Financial Alert: Your expenses are exceeding";

    let emailBody = `
    Dear ${user},
    
    Your ${budget_type.toLowerCase()} expenses have reached ${percentage_alert}% of the specified budget. It's essential to monitor your spending to stay within your financial goals.
    
    Consider reviewing your recent transactions and adjusting your budget if necessary.
    
    Thank you for your commitment to financial well-being. We appreciate your trust in FinancialTracker.
    
    Best regards,
    FinanceTracker
    `;


    if (budget_type.toLowerCase() === "weekly") {
        const thisWeekExpense = financialMetrics.expense.this_week;
        if (thisWeekExpense >= amount_alert) {
            sendEmail(sendTo, subject, emailBody);
        }
    }
    else if (budget_type.toLowerCase() === "monthly") {
        const thisMonthExpense = financialMetrics.expense.this_month;
        if (thisYearExpense >= amount_alert) {
            sendEmail(sendTo, subject, emailBody);
        }
    }
    else if (budget_type.toLowerCase() === "yearly") {
        const thisYearExpense = financialMetrics.expense.this_year;
        if (thisYearExpense >= amount_alert) {
            sendEmail(sendTo, subject, emailBody);
        }
    }
}

module.exports = {
    checkBudget,
};
