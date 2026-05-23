import Razorpay from 'razorpay';
import crypto from 'crypto';
import logger from '../utils/logger.js';

let razorpayClient = null;

function getRazorpayClient() {
  if (razorpayClient) {
    return razorpayClient;
  }

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    logger.error('Razorpay credentials missing in environment variables', {
      keyId: Boolean(RAZORPAY_KEY_ID),
      keySecret: Boolean(RAZORPAY_KEY_SECRET),
    });
    throw new Error('Razorpay credentials are not configured');
  }

  razorpayClient = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  return razorpayClient;
}

export async function createRazorpayOrder({ amount, currency, receipt, notes }) {
  const orderOptions = {
    amount,
    currency,
    receipt,
    payment_capture: 1,
    notes,
  };

  try {
    const razorpay = getRazorpayClient();
    logger.debug('Razorpay order payload', orderOptions);
    const order = await razorpay.orders.create(orderOptions);
    logger.info('Razorpay order created successfully', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
    return order;
  } catch (error) {
    logger.error('Razorpay order creation failed', {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode || 'unknown',
      errorBody: error.error || null,
      orderOptions,
      stack: error.stack,
    });
    throw new Error(error.message || 'Failed to create Razorpay order');
  }
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  const isValid = expectedSignature === signature;
  if (!isValid) {
    logger.warn('Razorpay signature verification failed', {
      orderId,
      paymentId,
      signature,
      expectedSignature,
    });
  }

  return isValid;
}
