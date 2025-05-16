const db = require('../config/db');

const createUser = async (user) => {
  return await db('users').insert(user);
};

const getAllUsers = async () => {
  return await db('users').select('*');
};

module.exports = {
  createUser,
  getAllUsers
};
