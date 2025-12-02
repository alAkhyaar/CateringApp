const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authenticate, authorize, authorizeAction } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(authenticate);

// View routes - accessible by ADMIN_SDM, SUPER_ADMIN, PEMILIK
router.get('/', authorize('ADMIN_SDM'), employeeController.getAllEmployees);
router.get('/stats', authorize('ADMIN_SDM'), employeeController.getEmployeeStats);
router.get('/:id', authorize('ADMIN_SDM'), employeeController.getEmployeeById);

// Action routes - only ADMIN_SDM and SUPER_ADMIN
router.post('/', authorizeAction('ADMIN_SDM'), upload.single('photo'), employeeController.createEmployee);
router.put('/:id', authorizeAction('ADMIN_SDM'), upload.single('photo'), employeeController.updateEmployee);
router.delete('/:id', authorizeAction('ADMIN_SDM'), employeeController.deleteEmployee);

module.exports = router;

