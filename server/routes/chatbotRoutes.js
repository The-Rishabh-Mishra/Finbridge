import express from 'express';
import {
  queryBankingChatbot,
  isBankingRelated,
  checkRateLimit,
  sanitizeMessage,
} from '../utils/chatbotService.js';
import authMiddleware from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/chatbot/query
 * Process user message and return AI response
 * Requires authentication
 */
router.post('/query', authMiddleware, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid message format',
      });
    }

    // Check rate limit (20 messages per hour)
    if (!checkRateLimit(req.user.id, 20, 3600000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many messages. Please wait before sending another message.',
      });
    }

    // Sanitize message
    const sanitizedMessage = sanitizeMessage(message);

    // Check if message is banking-related
    // (optional: can be disabled for more flexible interactions)
    if (!isBankingRelated(sanitizedMessage)) {
      return res.status(200).json({
        success: true,
        response:
          'I specialize in banking and finance topics. Please ask me about credit scores, loans, interest rates, savings, or other banking-related questions! 🏦',
      });
    }

    // Query the chatbot
    const result = await queryBankingChatbot(sanitizedMessage, conversationHistory);

    if (result.success) {
      return res.status(200).json({
        success: true,
        response: result.response,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.response || 'Failed to process your request',
      });
    }
  } catch (error) {
    logger.error('Chatbot route error:', { message: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
    });
  }
});

/**
 * GET /api/chatbot/health
 * Check if chatbot service is available
 */
router.get('/health', (req, res) => {
  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    res.status(200).json({
      success: true,
      status: hasApiKey ? 'operational' : 'misconfigured',
      message: hasApiKey
        ? 'Banking Assistant is ready'
        : 'Banking Assistant is not configured',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Unable to determine chatbot status',
    });
  }
});

export default router;

