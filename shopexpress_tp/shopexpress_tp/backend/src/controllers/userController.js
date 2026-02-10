const db = require('../config/database');

const getProfile = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, created_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    const result = await db.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING id, email, first_name, last_name, role`,
      [firstName, lastName, req.user.id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const getOrders = async (req, res) => {
  try {
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
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getOrders
};
