const db = require('../config/db');

const createBudget = async ({ user_id, category, limit, month }) => {
  return await db('budgets').insert({ user_id, category, limit, month });
};

const getAllBudgets = async (user_id) => {
  return await db('budgets').where({ user_id });
};

const getBudgetSummary = async (user_id, month) => {
  const budgets = await db('budgets')
    .where({ user_id })
    .andWhere('month', month);

  const monthStr = month.slice(0, 7); // "YYYY-MM"

  const transactions = await db('transactions')
    .whereRaw("user_id = ? AND strftime('%Y-%m', created_at) = ?", [user_id, monthStr]);

  const summary = budgets.map(b => {
    const spent = transactions
      .filter(t => t.category === b.category)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const percentage = Math.round((spent / b.limit) * 100);
    const remaining = parseFloat((b.limit - spent).toFixed(2));
    const warning = percentage >= 80;
    const suggestion = warning ? "Razmisli o smanjenju potrošnje." : "";

    return {
      category: b.category,
      limit: parseFloat(b.limit),
      spent,
      remaining,
      percentage,
      warning,
      suggestion
    };
  });

  return summary;
};

module.exports = {
  createBudget,
  getAllBudgets,
  getBudgetSummary
};
