const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes publiques
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProduct);

module.exports = router;
