const express = require('express');
const router = express.Router();
const orderInController = require('../controllers/orderIn.controller');
const { authenticate, authorize, authorizeAction } = require('../middleware/auth.middleware');

router.use(authenticate);

// View routes - accessible by ADMIN_CS, SUPER_ADMIN, PEMILIK
router.get('/', authorize('ADMIN_CS'), orderInController.getAllOrdersIn);
router.get('/summary', authorize('ADMIN_CS'), orderInController.getOrderInSummary);
router.get('/:id', authorize('ADMIN_CS'), orderInController.getOrderInById);

// Action routes - only ADMIN_CS and SUPER_ADMIN
router.post('/', authorizeAction('ADMIN_CS'), orderInController.createOrderIn);
router.put('/:id', authorizeAction('ADMIN_CS'), orderInController.updateOrderIn);
router.delete('/:id', authorizeAction('ADMIN_CS'), orderInController.deleteOrderIn);

module.exports = router;

