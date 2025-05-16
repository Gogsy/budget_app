const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Sva polja su obavezna.' });
    }

    await userService.createUser({ name, email, password });
    res.status(201).json({ message: 'Korisnik dodan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška kod dodavanja korisnika.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška kod dohvaćanja korisnika.' });
  }
};

module.exports = {
  createUser,
  getUsers
};
