const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');
const emailService = require('../services/emailService');
const { validateEmail } = require('../middleware/validation');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validation basique
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    // VÃ©rifier si l'utilisateur existe
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);
    
    // CrÃ©er l'utilisateur
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, 'client') 
       RETURNING id, email, first_name, last_name, role`,
      [email, passwordHash, firstName, lastName]
    );
    
    const user = result.rows[0];
    
    // CrÃ©er un panier pour l'utilisateur
    await db.query(
      'INSERT INTO carts (user_id) VALUES ($1)',
      [user.id]
    );
    
    // GÃ©nÃ©rer JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // RÃ©cupÃ©rer l'utilisateur
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // VÃ©rifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // GÃ©nÃ©rer JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      // Ne pas rÃ©vÃ©ler si l'email existe ou non
      return res.json({ message: 'If the email exists, a reset link will be sent' });
    }
    
    const userId = result.rows[0].id;
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure
    
    await db.query(
      `INSERT INTO password_resets (user_id, reset_token, expires_at) 
       VALUES ($1, $2, $3)`,
      [userId, resetToken, expiresAt]
    );
    
    // Envoyer l'email
    await emailService.sendPasswordResetEmail(email, resetToken);
    
    res.json({ message: 'If the email exists, a reset link will be sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Request failed' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const result = await db.query(
      `SELECT user_id FROM password_resets 
       WHERE reset_token = $1 AND expires_at > NOW() AND used = false`,
      [token]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    const userId = result.rows[0].user_id;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Mettre Ã  jour le mot de passe
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );
    
    // Marquer le token comme utilisÃ©
    await db.query(
      'UPDATE password_resets SET used = true WHERE reset_token = $1',
      [token]
    );
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Reset failed' });
  }
};

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword
};
