import logger from '../utils/logger.js';
import User from '../models/User.js';

/* ===================== GET USER PROFILE ===================== */
export async function getUserProfile(req, res) {
  try {
    if (req.userId === 'demo-user') {
      return res.status(200).json({
        success: true,
        user: {
          id: 'demo-user',
          name: 'John Doe',
          email: 'john.doe@example.com',
          profileCompleted: true,
          profileCompletionPercentage: 100,
          isDemo: true,
        },
      });
    }

    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    logger.error('Get profile error', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

/* ===================== UPDATE USER PROFILE ===================== */
export async function updateUserProfile(req, res) {
  try {
    if (req.userId === 'demo-user') {
      return res.status(403).json({ error: 'Demo user profile is read-only' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const allowedFields = [
      'phone',
      'pan',
      'aadhar',
      'dob',
      'address',
      'city',
      'state',
      'pincode',
      'income',
      'occupation',
    ];

    let updated = false;

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = field === 'dob' ? new Date(req.body[field]) : req.body[field];
        updated = true;
      }
    });

    if (updated) {
      user.calculateProfileCompletion();
      await user.save();
    }

    logger.info('User profile updated', { userId: req.userId });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    logger.error('Update profile error', error.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

/* ===================== GET DASHBOARD ===================== */
export async function getDashboardData(req, res) {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const score = user.creditScore || 650;

    const dashboardData = {
      user: user.toJSON(),
      creditScore: score,
      scoreInsight: getScoreInsight(score),
      previousScore: user.previousScore || 620,
      scoreHistory: user.scoreHistory || [],
      trend: user.trend || 'up',
      trendPercentage: user.trendPercentage || 5.2,
      creditFactors: generateCreditFactors(user),
      aiRecommendations: [],
      loanSuggestions: generateLoanSuggestions(user),
      recentTransactions: user.recentTransactions || [],
      accountHealth: {
        score: user.accountHealth?.score || 75,
        status: user.accountHealth?.status || 'Good',
        lastUpdated: new Date().toISOString(),
        assessments: user.accountHealth?.assessments || [],
      },
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    logger.error('Get dashboard data error', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

/* ===================== UPDATE DASHBOARD ===================== */
export async function updateUserDashboardData(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { creditScore, scoreHistory, recentTransactions, accountHealth } = req.body;

    if (creditScore !== undefined) user.creditScore = creditScore;
    if (scoreHistory) user.scoreHistory = scoreHistory;
    if (recentTransactions) user.recentTransactions = recentTransactions;
    if (accountHealth) user.accountHealth = accountHealth;

    await user.save();

    logger.info('User dashboard data updated', { userId: req.userId });

    res.status(200).json({
      success: true,
      message: 'Dashboard data updated successfully',
    });
  } catch (error) {
    logger.error('Update dashboard data error', error.message);
    res.status(500).json({ error: 'Failed to update dashboard data' });
  }
}

/* ===================== HELPERS ===================== */
const getScoreInsight = (score) => {
  if (score >= 800) return 'Excellent - Prime lending rates available';
  if (score >= 740) return 'Very Good - Competitive rates and terms';
  if (score >= 670) return 'Good - Standard rates available';
  if (score >= 580) return 'Fair - Limited options, higher rates';
  return 'Poor - Very limited options, highest rates';
};

const generateCreditFactors = (user) => {
  const factors = user.creditFactors || {
    paymentHistory: 85,
    creditUtilization: 35,
    creditHistory: 4.2,
    creditMix: 6,
    newInquiries: 2,
  };

  return [
    {
      name: 'Payment History',
      percentage: factors.paymentHistory,
      weight: 35,
      status: factors.paymentHistory >= 90 ? 'Excellent' : 'Good',
      insight: 'Consistent on-time payments.',
    },
    {
      name: 'Credit Utilization',
      percentage: factors.creditUtilization,
      weight: 30,
      status: factors.creditUtilization <= 30 ? 'Excellent' : 'Good',
      insight: `${factors.creditUtilization}% utilization.`,
    },
    {
      name: 'Credit History',
      percentage: (factors.creditHistory / 10) * 100,
      weight: 15,
      status: factors.creditHistory >= 5 ? 'Excellent' : 'Good',
      insight: `${factors.creditHistory} years history.`,
    },
    {
      name: 'Credit Mix',
      percentage: factors.creditMix * 10,
      weight: 10,
      status: factors.creditMix >= 7 ? 'Excellent' : 'Good',
      insight: `${factors.creditMix} account types.`,
    },
    {
      name: 'New Inquiries',
      percentage: Math.max(0, 100 - factors.newInquiries * 10),
      weight: 10,
      status: factors.newInquiries <= 1 ? 'Excellent' : 'Good',
      insight: `${factors.newInquiries} inquiries.`,
    },
  ];
};

const generateLoanSuggestions = (user) => {
  const score = user.creditScore || 650;
  const suggestions = [];

  if (score >= 750) {
    suggestions.push({
      id: 'LOAN001',
      type: 'Personal Loan',
      amount: 500000,
      interestRate: 8.5,
      tenure: 60,
      recommendation: 'Recommended',
      eligibilityScore: 95,
    });
  }

  if (score >= 700) {
    suggestions.push({
      id: 'LOAN002',
      type: 'Home Loan',
      amount: 2000000,
      interestRate: 6.5,
      tenure: 240,
      recommendation: 'Available',
      eligibilityScore: 88,
    });
  }

  return suggestions;
};