const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateProduct = (req, res, next) => {
  const { name, price, stock } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid product name' });
  }
  
  if (!price || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Invalid price' });
  }
  
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ error: 'Invalid stock' });
  }
  
  next();
};

module.exports = { validateEmail, validateProduct };
