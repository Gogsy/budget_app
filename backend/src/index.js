const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ dodano
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API rute
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

// ✅ Serviraj frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
