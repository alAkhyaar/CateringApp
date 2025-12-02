const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

// Only PEMILIK and SUPER_ADMIN can view activities
router.get('/', authorize('PEMILIK', 'SUPER_ADMIN'), activityController.getAllActivities);
router.get('/summary', authorize('PEMILIK', 'SUPER_ADMIN'), activityController.getActivitySummary);
router.get('/user/:userId', authorize('PEMILIK', 'SUPER_ADMIN'), activityController.getUserActivity);

module.exports = router;

