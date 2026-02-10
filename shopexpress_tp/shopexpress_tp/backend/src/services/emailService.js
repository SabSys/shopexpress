const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendOrderConfirmation = async (email, order) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: `Order Confirmation - #${order.id}`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <p>Order ID: ${order.id}</p>
      <p>Total: €${order.total_amount}</p>
      <p>Status: ${order.status}</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendOrderConfirmation
};
