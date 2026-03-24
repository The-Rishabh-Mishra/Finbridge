import axios from 'axios';
import logger from './logger.js';

const BANKING_SYSTEM_PROMPT = `You are an expert Banking and Finance Assistant for FinBridge. Your role is to help users understand financial concepts, banking terms, credit scores, loans, and related topics.

IMPORTANT RULES:
1. You ONLY answer questions about banking, finance, credit scores, loans, interest rates, savings, investments, CIBIL, EMI, and related financial topics.
2. If someone asks about non-banking topics (movies, sports, news, general knowledge, etc.), politely redirect them and say: "I specialize in banking and finance topics. Please ask me about credit scores, loans, interest rates, savings, or other banking-related questions!"
3. Be accurate and helpful. Provide practical information users can understand.
4. Keep responses concise but informative (2-3 sentences max).
5. Use simple language and avoid jargon when possible.
6. Include practical examples where relevant.

BANKING TOPICS YOU CAN HELP WITH:
- CIBIL Score (what it is, how to improve it, factors affecting it)
- Credit Score (definition, importance, improvement tips)
- Loans (types: personal, home, auto, business loans)
- EMI (Equated Monthly Installment calculation, meaning)
- Interest Rates (how calculated, types: simple vs compound)
- Savings Accounts (types, benefits, ROI)
- Investment Tips (diversification, risk management)
- Debt Management (clearing debt, credit utilization)
- Banking Terms (APR, LTV, CIBIL, DPD, etc.)

TONE: Professional, helpful, friendly, and encouraging.`;

/**
 * Query the chatbot with user message and conversation history
 * Uses OpenAI API (or can be configured for other AI services)
 */
export const queryBankingChatbot = async (userMessage, conversationHistory = []) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      logger.error('OpenAI API key not configured');
      return {
        success: false,
        response: 'Banking Assistant is temporarily unavailable. Please try again later.',
        error: 'API key not configured',
      };
    }

    // Build conversation for API
    const messages = [
      {
        role: 'system',
        content: BANKING_SYSTEM_PROMPT,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 200,
        top_p: 0.9,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const botMessage = response.data.choices[0].message.content.trim();
      
      return {
        success: true,
        response: botMessage,
      };
    }

    return {
      success: false,
      response: 'Unable to generate response. Please try again.',
      error: 'Invalid API response',
    };
  } catch (error) {
    logger.error('Chatbot API error:', { message: error.message, status: error.response?.status, data: error.response?.data });
    
    // Provide fallback response
    if (error.response?.status === 401) {
      return {
        success: false,
        response: 'Authentication error. Please contact support.',
        error: 'API authentication failed',
      };
    }

    if (error.response?.status === 429) {
      return {
        success: false,
        response: 'Too many requests. Please wait a moment before sending another message.',
        error: 'Rate limit exceeded',
      };
    }

    // Fallback mock response for banking questions
    const mockResponses = [
      "Your CIBIL score is calculated based on your credit history, payment behavior, and other factors. A higher score (700+) improves loan approval chances.",
      "EMI stands for Equated Monthly Installment. It's the fixed amount you pay monthly for loan repayment, including principal and interest.",
      "To improve your credit score, pay bills on time, reduce debt utilization below 30%, and avoid multiple loan applications in short periods.",
      "Personal loans typically have interest rates of 10-20% per annum, depending on your credit score and lender policies.",
      "A savings account earns interest on your deposits. Current rates are around 3-6% per annum for regular savings accounts.",
    ];

    const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return {
      success: true,
      response: mockResponse,
    };
  }
};

/**
 * Validate that message is banking-related
 * Prevents obvious spam and off-topic questions
 */
export const isBankingRelated = (message) => {
  const bankingKeywords = [
    'cibil',
    'credit score',
    'loan',
    'interest',
    'emi',
    'savings',
    'bank',
    'finance',
    'investment',
    'debt',
    'apr',
    'apy',
    'ltv',
    'dob',
    'income',
    'mortgage',
    'debit',
    'credit',
    'account',
    'atm',
    'transfer',
    'banking',
    'financial',
    'money',
    'payment',
    'installment',
  ];

  const lowerMessage = message.toLowerCase();
  return bankingKeywords.some((keyword) => lowerMessage.includes(keyword));
};

/**
 * Rate limit check (simple implementation)
 */
const messageCountMap = new Map();

export const checkRateLimit = (userId, maxMessages = 20, windowMs = 3600000) => {
  // windowMs = 1 hour default
  
  if (!messageCountMap.has(userId)) {
    messageCountMap.set(userId, {
      count: 1,
      resetTime: Date.now() + windowMs,
    });
    return true;
  }

  const userData = messageCountMap.get(userId);
  
  if (Date.now() > userData.resetTime) {
    // Reset window
    messageCountMap.set(userId, {
      count: 1,
      resetTime: Date.now() + windowMs,
    });
    return true;
  }

  if (userData.count >= maxMessages) {
    return false;
  }

  userData.count += 1;
  return true;
};

/**
 * Sanitize user input
 */
export const sanitizeMessage = (message) => {
  return message
    .trim()
    .substring(0, 500) // Limit message length
    .replace(/[<>]/g, ''); // Remove potential HTML
};

