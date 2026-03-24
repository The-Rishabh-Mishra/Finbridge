import logger from '../utils/logger.js';
import { calculateCreditScore, getScoreCategory, getScoreRecommendations } from '../utils/calculateScore.js';

export async function getCreditScore(req, res) {
  try {
    // TODO: Fetch user data and calculate score
    const mockUserData = {
      paymentHistory: { missedPayments: 0, onTimePayments: 48 },
      creditUtilization: 25,
      historyLength: 120,
      creditMix: { creditCard: true, autoLoan: true },
      newCredit: 0,
    };

    const score = calculateCreditScore(mockUserData);
    const category = getScoreCategory(score);

    res.status(200).json({
      success: true,
      score,
      category,
      data: mockUserData,
    });
  } catch (error) {
    logger.error('Get credit score error', error.message);
    res.status(500).json({ error: 'Failed to calculate credit score' });
  }
}

export async function getCreditReport(req, res) {
  try {
    // TODO: Fetch actual report data
    const report = {
      score: 750,
      scoreRange: { min: 300, max: 900 },
      factors: [
        { name: 'Payment History', weight: 35, status: 'Excellent' },
        { name: 'Credit Utilization', weight: 30, status: 'Good' },
        { name: 'Length of History', weight: 15, status: 'Good' },
        { name: 'Credit Mix', weight: 10, status: 'Fair' },
        { name: 'New Credit', weight: 10, status: 'Good' },
      ],
      lastUpdated: new Date(),
    };

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    logger.error('Get credit report error', error.message);
    res.status(500).json({ error: 'Failed to fetch credit report' });
  }
}

export async function getLoanSuggestions(req, res) {
  try {
    // TODO: Generate loan suggestions based on credit score
    const mockUserData = {
      paymentHistory: { missedPayments: 0 },
      creditUtilization: 25,
      historyLength: 120,
      creditMix: { creditCard: true, autoLoan: true },
      newCredit: 0,
    };

    const score = calculateCreditScore(mockUserData);
    const recommendations = getScoreRecommendations(score, mockUserData);

    const suggestions = [
      {
        type: 'Personal Loan',
        amount: 500000,
        interestRate: 8.5,
        tenure: 60,
        recommendation: score >= 700 ? 'Recommended' : 'Available',
        color: score >= 700 ? '#27ae60' : '#f39c12',
      },
      {
        type: 'Home Loan',
        amount: 2000000,
        interestRate: 6.5,
        tenure: 240,
        recommendation: score >= 750 ? 'Recommended' : 'Available',
        color: score >= 750 ? '#27ae60' : '#f39c12',
      },
    ];

    res.status(200).json({
      success: true,
      suggestions,
      recommendations,
    });
  } catch (error) {
    logger.error('Get loan suggestions error', error.message);
    res.status(500).json({ error: 'Failed to fetch loan suggestions' });
  }
}

