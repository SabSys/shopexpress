const db = require('../config/database');

const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }
    
    if (minPrice) {
      query += ` AND price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }
    
    if (maxPrice) {
      query += ` AND price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const query = `SELECT * FROM products WHERE name ILIKE '%${q}%' OR description ILIKE '%${q}%'`;
    
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProduct
};
