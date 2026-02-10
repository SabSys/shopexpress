const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, paymentMethodId) => {
  try {
    // Convertir en centimes
    const amountInCents = Math.round(amount * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
};

const refundPayment = async (paymentIntentId, amount) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined
    });
    
    return refund;
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw error;
  }
};

module.exports = {
  createPaymentIntent,
  refundPayment
};
