const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');
const { authenticate, authorize, authorizeAction } = require('../middleware/auth.middleware');

router.use(authenticate);

// View routes - accessible by ADMIN_KEUANGAN, SUPER_ADMIN, PEMILIK
router.get('/', authorize('ADMIN_KEUANGAN'), incomeController.getAllIncomes);
router.get('/summary', authorize('ADMIN_KEUANGAN'), incomeController.getIncomeSummary);
router.get('/:id', authorize('ADMIN_KEUANGAN'), incomeController.getIncomeById);

// Action routes - only ADMIN_KEUANGAN and SUPER_ADMIN
router.post('/', authorizeAction('ADMIN_KEUANGAN'), incomeController.createIncome);
router.put('/:id', authorizeAction('ADMIN_KEUANGAN'), incomeController.updateIncome);
router.delete('/:id', authorizeAction('ADMIN_KEUANGAN'), incomeController.deleteIncome);

module.exports = router;

