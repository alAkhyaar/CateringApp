const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { authenticate, authorize, authorizeAction } = require('../middleware/auth.middleware');

router.use(authenticate);

// View routes
router.get('/', authorize('ADMIN_KEUANGAN'), expenseController.getAllExpenses);
router.get('/summary', authorize('ADMIN_KEUANGAN'), expenseController.getExpenseSummary);
router.get('/:id', authorize('ADMIN_KEUANGAN'), expenseController.getExpenseById);

// Action routes
router.post('/', authorizeAction('ADMIN_KEUANGAN'), expenseController.createExpense);
router.put('/:id', authorizeAction('ADMIN_KEUANGAN'), expenseController.updateExpense);
router.delete('/:id', authorizeAction('ADMIN_KEUANGAN'), expenseController.deleteExpense);

module.exports = router;

