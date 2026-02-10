const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const validatePasswordStrength = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  // Pas de vérification de complexité (majuscules, chiffres, caractères spéciaux)
  
  return { valid: true };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
