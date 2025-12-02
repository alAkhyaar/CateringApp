const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredient.controller');
const { authenticate, authorize, authorizeAction } = require('../middleware/auth.middleware');

router.use(authenticate);

// View routes - accessible by ADMIN_MENU, SUPER_ADMIN, PEMILIK
router.get('/', authorize('ADMIN_MENU'), ingredientController.getAllIngredients);
router.get('/summary', authorize('ADMIN_MENU'), ingredientController.getIngredientSummary);
router.get('/categories', authorize('ADMIN_MENU'), ingredientController.getIngredientCategories);
router.get('/:id', authorize('ADMIN_MENU'), ingredientController.getIngredientById);

// Action routes - only ADMIN_MENU and SUPER_ADMIN
router.post('/', authorizeAction('ADMIN_MENU'), ingredientController.createIngredient);
router.put('/:id', authorizeAction('ADMIN_MENU'), ingredientController.updateIngredient);
router.delete('/:id', authorizeAction('ADMIN_MENU'), ingredientController.deleteIngredient);

module.exports = router;

