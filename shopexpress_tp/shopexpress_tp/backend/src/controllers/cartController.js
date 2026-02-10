const db = require('../config/database');

const getCart = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.id as cart_id,
              json_agg(json_build_object(
                'id', ci.id,
                'product_id', ci.product_id,
                'product_name', p.name,
                'product_price', p.price,
                'quantity', ci.quantity,
                'subtotal', ci.quantity * p.price
              )) as items
       FROM carts c
       LEFT JOIN cart_items ci ON c.id = ci.cart_id
       LEFT JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1
       GROUP BY c.id`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Récupérer le panier de l'utilisateur
    const cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [req.user.id]
    );
    
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const cartId = cartResult.rows[0].id;
    
    // Vérifier si le produit existe
    const productResult = await db.query(
      'SELECT id, stock FROM products WHERE id = $1',
      [productId]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult.rows[0];
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    // Vérifier si l'item existe déjà dans le panier
    const existingItem = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );
    
    if (existingItem.rows.length > 0) {
      // Mettre à jour la quantité
      const newQuantity = existingItem.rows[0].quantity + quantity;
      await db.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Ajouter un nouvel item
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
        [cartId, productId, quantity]
      );
    }
    
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2',
      [quantity, id]
    );
    
    res.json({ message: 'Item updated' });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

const removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM cart_items WHERE id = $1', [id]);
    
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem
};
