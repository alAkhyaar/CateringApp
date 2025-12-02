const express = require('express');
const router = express.Router();
const orderOutController = require('../controllers/orderOut.controller');
const { authenticate, authorize, authorizeAction } = require('../middleware/auth.middleware');

router.use(authenticate);

// View routes
router.get('/', authorize('ADMIN_CS'), orderOutController.getAllOrdersOut);
router.get('/summary', authorize('ADMIN_CS'), orderOutController.getOrderOutSummary);
router.get('/:id', authorize('ADMIN_CS'), orderOutController.getOrderOutById);

// Action routes
router.post('/', authorizeAction('ADMIN_CS'), orderOutController.createOrderOut);
router.put('/:id', authorizeAction('ADMIN_CS'), orderOutController.updateOrderOut);
router.delete('/:id', authorizeAction('ADMIN_CS'), orderOutController.deleteOrderOut);

module.exports = router;

