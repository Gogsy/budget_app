const db = require('../config/db');

const createAccount = async (account) => {
  return await db('accounts').insert(account);
};

const getAccountsByUser = async (userId) => {
  return await db('accounts').where('user_id', userId);
};

module.exports = {
  createAccount,
  getAccountsByUser
};
