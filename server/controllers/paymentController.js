import logger from '../utils/logger.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from '../services/razorpayService.js';

const planCatalog = {
  premium_plus: {
    planName: 'Premium Plus',
    amount: 999, // Amount in paise: INR 9.99
    currency: 'INR',
    durationDays: 30,
  },
};

export async function createPaymentOrder(req, res) {
  try {
    logger.debug('Payment create-order called', {
      userId: req.userId,
      requestBody: req.body,
    });
    const { planId } = req.body;
    const plan = planCatalog[planId];

    if (!plan) {
      return res.status(400).json({ error: 'Invalid subscription plan selected' });
    }

    // Razorpay limits `receipt` to 40 characters maximum.
    // The previous receipt included the full userId and a timestamp which could exceed
    // Razorpay's 40 char limit and caused order creation to fail with a 500 error.
    // To fix this, create a compact but unique receipt string:
    //  - prefix: 'rcpt_' to indicate a receipt
    //  - shortUser: last 8 chars of userId (Mongo ObjectId is long, last chars are enough)
    //  - ts: timestamp encoded in base36 for compactness
    // Finally ensure the receipt does not exceed the MAX length.
    const MAX_RECEIPT_LENGTH = 40;
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized: missing user id' });
    }

    // Build a short, unique receipt and guarantee it fits within Razorpay limits
    const shortUser = String(req.userId).slice(-8);
    const ts = Date.now().toString(36);
    let receipt = `rcpt_${shortUser}_${ts}`;
    if (receipt.length > MAX_RECEIPT_LENGTH) {
      // Truncate the timestamp portion if needed (preserve prefix + shortUser)
      const prefix = `rcpt_${shortUser}_`;
      const allowedTsLen = Math.max(1, MAX_RECEIPT_LENGTH - prefix.length);
      receipt = prefix + ts.slice(0, allowedTsLen);
    }

    // Validate plan amount before creating order
    if (!Number.isInteger(plan.amount) || plan.amount <= 0) {
      return res.status(400).json({ error: 'Invalid plan amount configured' });
    }
    const order = await createRazorpayOrder({
      amount: plan.amount,
      currency: plan.currency,
      receipt,
      notes: {
        userId: req.userId,
        planName: plan.planName,
      },
    });

    logger.info('Created Razorpay order request', {
      userId: req.userId,
      planId,
      amount: plan.amount,
      orderId: order.id,
      currency: plan.currency,
    });

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      // Provide frontend with the public Razorpay Key ID so checkout can be initialized
      // We do NOT send the secret. This is safe: key id is public-facing and required
      // by Razorpay Checkout to identify the merchant account in client-side flow.
      keyId: process.env.RAZORPAY_KEY_ID || null,
      plan: {
        id: planId,
        name: plan.planName,
        amount: plan.amount,
        currency: plan.currency,
      },
    });
  } catch (error) {
    logger.error('Create payment order error', {
      message: error.message,
      stack: error.stack,
    });
    const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Unable to create payment order';
    res.status(500).json({ error: errorMessage });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    const plan = planCatalog[planId];

    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan provided for verification' });
    }

    const verified = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!verified) {
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

    const payment = await Payment.create({
      user: req.userId,
      planName: plan.planName,
      amount: plan.amount,
      currency: plan.currency,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: 'paid',
      expiryDate,
    });

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found while updating subscription' });
    }

    user.subscriptionStatus = 'active';
    user.subscriptionPlan = plan.planName;
    user.subscriptionAmount = plan.amount;
    user.subscriptionExpiry = expiryDate;
    user.subscriptionStart = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment: payment.toObject(),
      subscription: {
        planName: user.subscriptionPlan,
        status: user.subscriptionStatus,
        expiryDate: user.subscriptionExpiry,
      },
    });
  } catch (error) {
    logger.error('Verify payment error', error.message);
    res.status(500).json({ error: 'Unable to verify payment' });
  }
}
