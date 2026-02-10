const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/', authenticate, orderController.createOrder);
router.post('/:id/payment', authenticate, orderController.processPayment);
router.get('/:id', authenticate, orderController.getOrder);

module.exports = router;
