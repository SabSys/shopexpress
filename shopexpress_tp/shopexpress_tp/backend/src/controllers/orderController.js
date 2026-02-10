const db = require('../config/database');
const paymentService = require('../services/paymentService');

const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    // Récupérer le panier
    const cartResult = await db.query(
      `SELECT c.id, ci.product_id, ci.quantity, p.price
       FROM carts c
       JOIN cart_items ci ON c.id = ci.cart_id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    
    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculer le total
    const total = cartResult.rows.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
    
    // Créer la commande
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status) 
       VALUES ($1, $2, $3, 'pending') 
       RETURNING id`,
      [req.user.id, total, shippingAddress]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Ajouter les items de commande
    for (const item of cartResult.rows) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }
    
    // Vider le panier
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1',
      [cartResult.rows[0].id]
    );
    
    res.status(201).json({ orderId, total });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethodId } = req.body;
    
    // Récupérer la commande
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order already processed' });
    }
    
    // Traiter le paiement avec Stripe
    const paymentIntent = await paymentService.createPaymentIntent(
      order.total_amount,
      paymentMethodId
    );
    
    // Mettre à jour la commande
    await db.query(
      `UPDATE orders 
       SET status = 'paid', stripe_payment_id = $1 
       WHERE id = $2`,
      [paymentIntent.id, id]
    );
    
    res.json({ message: 'Payment successful', paymentIntent });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT o.*, 
              json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', p.name,
                'quantity', oi.quantity,
                'unit_price', oi.unit_price
              )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

module.exports = {
  createOrder,
  processPayment,
  getOrder
};
