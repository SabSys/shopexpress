const db = require('../config/database');

const getUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, created_at 
       FROM users ORDER BY created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, created_at 
       FROM users WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role } = req.body;
    
    const result = await db.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, role = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING id, email, first_name, last_name, role`,
      [firstName, lastName, role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    
    const result = await db.query(
      `INSERT INTO products (name, description, price, stock, category, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description, price, stock || 0, category, imageUrl]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, imageUrl } = req.body;
    
    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4, 
           category = $5, image_url = $6 
       WHERE id = $7 
       RETURNING *`,
      [name, description, price, stock, category, imageUrl, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, 
              u.email as user_email,
              u.first_name as user_first_name,
              u.last_name as user_last_name,
              json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', p.name,
                'quantity', oi.quantity,
                'unit_price', oi.unit_price
              )) as items
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id, u.id
       ORDER BY o.created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders
};
