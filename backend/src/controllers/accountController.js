const createAccount = async (req, res) => {
  try {
    const { user_id, name, type, balance, overdraft_limit } = req.body;
    if (!user_id || !name || !type || balance == null) {
      return res.status(400).json({ error: 'Sva polja osim overdraft su obavezna.' });
    }
    await accountService.createAccount({ user_id, name, type, balance, overdraft_limit });
    res.status(201).json({ message: 'Račun dodan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom dodavanja računa.' });
  }
};

const getAccounts = async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id je obavezan parametar.' });

  try {
    const accounts = await accountService.getAccountsByUser(userId);
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri dohvaćanju računa.' });
  }
};

module.exports = {
  createAccount,
  getAccounts
};
