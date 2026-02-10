const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const { validateProduct } = require('../middleware/validation');
const adminController = require('../controllers/adminController');

// Toutes les routes admin nÃ©cessitent authentification + rÃ´le admin
router.use(authenticate, requireAdmin);

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.post('/products', validateProduct, adminController.createProduct);
router.put('/products/:id', validateProduct, adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getAllOrders);

module.exports = router;
