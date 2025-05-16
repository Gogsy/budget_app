const db = require('../config/db');

const createTransaction = async (data) => {
  const { user_id, account_id, category, amount, type, description } = data;

  await db('transactions').insert({
    user_id,
    account_id,
    category,
    amount,
    type,
    description,
    created_at: new Date(),
  });
};

const getTransactionsByUser = async (user_id) => {
  console.log('Pozivam getTransactionsByUser za user_id:', user_id);
  return await db('transactions')
    .where('user_id', user_id)
    .orderBy('created_at', 'desc');
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
};
