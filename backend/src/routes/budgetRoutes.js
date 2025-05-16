const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetController');

router.get('/', controller.getBudgets);
router.post('/', controller.createBudget);
router.get('/summary', controller.getBudgetSummary);

module.exports = router;
