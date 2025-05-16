const budgetService = require('../services/budgetService');

const parseDate = (ddmmyyyy) => {
  const [day, month, year] = ddmmyyyy.split('.');
  return `${year}-${month}-${day}`;
};

const createBudget = async (req, res) => {
  try {
    const { user_id, category, limit, month } = req.body;

    if (!user_id || !category || !limit || !month) {
      return res.status(400).json({ error: 'Sva polja su obavezna.' });
    }

    const isoMonth = parseDate(month);
    await budgetService.createBudget({ user_id, category, limit, month: isoMonth });

    res.status(201).json({ message: 'Budžet dodan.' });
  } catch (err) {
    console.error(err);
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Budžet za tu kategoriju i mjesec već postoji.' });
    }
    res.status(500).json({ error: 'Greška na serveru.' });
  }
};

const getBudgets = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'Nedostaje user_id.' });

    const rows = await budgetService.getAllBudgets(user_id);

    const formatDate = (yyyymmdd) => {
      const [year, month, day] = yyyymmdd.split('-');
      return `${day}.${month}.${year}`;
    };

    const data = rows.map(b => ({
      ...b,
      month: formatDate(b.month)
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri dohvaćanju budžeta.' });
  }
};

const getBudgetSummary = async (req, res) => {
  try {
    const { user_id, month } = req.query;

    if (!user_id || !month) {
      return res.status(400).json({ error: 'Nedostaje parametar user_id ili month.' });
    }

    const isoMonth = (() => {
      const [day, monthStr, year] = month.split('.');
      return `${year}-${monthStr}-01`;
    })();

    const summary = await budgetService.getBudgetSummary(user_id, isoMonth);
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška kod dohvaćanja summary podataka.' });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetSummary
};
