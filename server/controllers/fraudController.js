import detectFraud from '../utils/fraudDetector.js';
import FraudMessage from '../models/FraudMessage.js';
import logger from '../utils/logger.js';

export async function checkMessage(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const result = detectFraud(message);

    // Optional persistence
    if (FraudMessage) {
      try {
        await FraudMessage.create({
          message: message.trim(),
          riskScore: result.riskScore,
          status: result.status,
          reasons: result.reasons,
        });
      } catch (dbError) {
        logger.error('Failed to save fraud message:', dbError.message);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    logger.error('Fraud check failed:', error.message);
    return res.status(500).json({ error: 'Failed to analyze message' });
  }
}

export default { checkMessage };
