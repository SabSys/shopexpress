const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, cartController.addItem);
router.put('/items/:id', authenticate, cartController.updateItem);
router.delete('/items/:id', authenticate, cartController.removeItem);

module.exports = router;
