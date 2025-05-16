const transactionService = require('../services/transactionService');

const createTransaction = async (req, res) => {
  try {
    const { user_id, account_id, category, amount, type, description } = req.body;

    if (!user_id || !account_id || !category || !amount || !type) {
      return res.status(400).json({ error: 'Sva polja osim opisa su obavezna.' });
    }

    await transactionService.createTransaction({
      user_id,
      account_id,
      category,
      amount,
      type,
      description
    });

    res.status(201).json({ message: 'Transakcija uspješno spremljena.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Greška prilikom spremanja transakcije.' });
  }
};

const getTransactions = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id je obavezan parametar.' });
  }

  try {
    console.log('Stižem do controller-a sa user_id:', user_id);
    const transactions = await transactionService.getTransactionsByUser(user_id);
    console.log('Transakcije:', transactions);
    res.json(transactions);
  } catch (err) {
    console.error('Greška u getTransactions:', err.message);
    res.status(500).json({ error: 'Greška kod dohvaćanja transakcija.' });
  }
};

module.exports = {
  createTransaction,
  getTransactions
};
