/**
 * User-Specific Mock Data Service with AI-Powered Models
 * Provides realistic credit data with AI insights and recommendations
 * Data is generated and stored per user for persistence and uniqueness
 */

import { getAIRecommendations, getScoreInsight } from './aiInsights.js';
import axios from './axiosInstance.js';

// Storage keys
const STORAGE_PREFIX = 'FinBridge_user_data_';
const USER_DATA_VERSION = '1.0';

// Utility functions for data generation
const generateUserId = (user) => {
  return user?.id || user?.email || 'anonymous';
};

const getStorageKey = (userId) => `${STORAGE_PREFIX}${userId}`;

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateSeededNumber = (userId, min, max, seed = 0) => {
  const hash = hashString(userId + seed.toString());
  const random = seededRandom(hash);
  return Math.floor(random * (max - min + 1)) + min;
};

const generateSeededFloat = (userId, min, max, decimals = 2, seed = 0) => {
  const hash = hashString(userId + seed.toString());
  const random = seededRandom(hash);
  const value = random * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
};

// Generate realistic names based on user ID
const generateUserName = (userId) => {
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Gupta',
    'Anjali Mehta', 'Rohit Jain', 'Kavita Agarwal', 'Suresh Reddy', 'Meera Joshi',
    'Arun Nair', 'Pooja Desai', 'Manoj Tiwari', 'Sunita Rao', 'Deepak Verma'
  ];
  const index = generateSeededNumber(userId, 0, names.length - 1, 1);
  return names[index];
};

// Generate realistic phone numbers
const generatePhoneNumber = (userId) => {
  const prefixes = ['98765', '87654', '76543', '65432', '54321'];
  const prefix = prefixes[generateSeededNumber(userId, 0, prefixes.length - 1, 2)];
  const suffix = generateSeededNumber(userId, 10000, 99999, 3);
  return `+91-${prefix}${suffix}`;
};

// Generate realistic PAN numbers
const generatePAN = (userId) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const first = letters[generateSeededNumber(userId, 0, 25, 4)];
  const second = letters[generateSeededNumber(userId, 0, 25, 5)];
  const third = letters[generateSeededNumber(userId, 0, 25, 6)];
  const fourth = letters[generateSeededNumber(userId, 0, 25, 7)];
  const fifth = letters[generateSeededNumber(userId, 0, 25, 8)];
  const numbers = generateSeededNumber(userId, 1000, 9999, 9);
  return `${first}${second}${third}${fourth}${fifth}${numbers}A`;
};

// Generate realistic account numbers
const generateAccountNumber = (userId, seed = 0) => {
  const base = generateSeededNumber(userId, 1000000000, 9999999999, seed);
  return `****${base.toString().slice(-4)}`;
};

// Generate realistic transaction descriptions
const generateTransactionDescription = (userId, type, seed = 0) => {
  const descriptions = {
    payment: [
      'Credit Card Payment - HDFC', 'Credit Card Payment - ICICI', 'Credit Card Payment - SBI',
      'EMI Payment - Car Loan', 'EMI Payment - Home Loan', 'EMI Payment - Personal Loan',
      'Mobile Bill Payment', 'Electricity Bill Payment', 'Gas Bill Payment'
    ],
    inquiry: [
      'Personal Loan Application', 'Home Loan Application', 'Car Loan Application',
      'Credit Card Application', 'Business Loan Application'
    ],
    charge: [
      'Online Purchase - Amazon', 'Online Purchase - Flipkart', 'Restaurant Payment',
      'Fuel Purchase', 'Grocery Shopping', 'Medical Expenses', 'Entertainment'
    ]
  };

  const list = descriptions[type] || descriptions.payment;
  const index = generateSeededNumber(userId, 0, list.length - 1, seed);
  return list[index];
};

// Main data generation functions
const generateUserCreditFactors = (userId) => {
  return {
    paymentHistory: generateSeededNumber(userId, 75, 98, 10),
    creditUtilization: generateSeededNumber(userId, 15, 85, 11),
    creditHistory: generateSeededFloat(userId, 1.5, 8.5, 1, 12),
    creditMix: generateSeededNumber(userId, 3, 10, 13),
    newInquiries: generateSeededNumber(userId, 0, 5, 14),
  };
};

const generateUserCreditScore = (userId, factors) => {
  // Base score calculation similar to FICO
  const baseScore = 300;
  const paymentScore = (factors.paymentHistory / 100) * 35;
  const utilizationScore = Math.max(0, 30 - (factors.creditUtilization / 100) * 30);
  const historyScore = Math.min(15, (factors.creditHistory / 10) * 15);
  const mixScore = Math.min(10, (factors.creditMix / 10) * 10);
  const inquiryScore = Math.max(0, 10 - factors.newInquiries);

  const totalScore = baseScore + paymentScore + utilizationScore + historyScore + mixScore + inquiryScore;
  return Math.min(900, Math.max(300, Math.round(totalScore)));
};

const generateUserProfile = (userId, user = {}) => {
  const name = user.name || generateUserName(userId);
  const email = user.email || `${name.toLowerCase().replace(' ', '.')}@example.com`;
  const phone = user.phone || generatePhoneNumber(userId);
  const pan = user.pan || generatePAN(userId);

  return {
    id: userId,
    name,
    email,
    phone,
    pan,
    createdAt: user.createdAt || new Date(Date.now() - generateSeededNumber(userId, 30, 365, 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    profileCompleted: generateSeededNumber(userId, 60, 100, 16),
  };
};

const generateCreditFactors = (userId, factors) => {
  return [
    {
      name: 'Payment History',
      percentage: factors.paymentHistory,
      weight: 35,
      status: factors.paymentHistory >= 90 ? 'Excellent' : factors.paymentHistory >= 80 ? 'Good' : 'Fair',
      insight: factors.paymentHistory >= 90
        ? 'You have consistently made on-time payments. This is excellent!'
        : 'Focus on making all payments on time to improve this factor.',
    },
    {
      name: 'Credit Utilization',
      percentage: factors.creditUtilization,
      weight: 30,
      status: factors.creditUtilization <= 30 ? 'Excellent' : factors.creditUtilization <= 50 ? 'Good' : 'Poor',
      insight: factors.creditUtilization <= 30
        ? 'Your credit card utilization is well below the recommended 30% threshold.'
        : 'Reduce your credit utilization by paying down balances.',
    },
    {
      name: 'Credit History',
      percentage: (factors.creditHistory / 10) * 100,
      weight: 15,
      status: factors.creditHistory >= 5 ? 'Excellent' : factors.creditHistory >= 3 ? 'Good' : 'Fair',
      insight: `Your ${factors.creditHistory} years of credit history is ${factors.creditHistory >= 5 ? 'excellent' : 'developing'}. More history will boost your score.`,
    },
    {
      name: 'Credit Mix',
      percentage: factors.creditMix * 10,
      weight: 10,
      status: factors.creditMix >= 7 ? 'Excellent' : factors.creditMix >= 5 ? 'Good' : 'Fair',
      insight: `You have ${factors.creditMix} types of credit accounts. A diverse mix helps your score.`,
    },
    {
      name: 'New Inquiries',
      percentage: Math.max(0, 100 - factors.newInquiries * 10),
      weight: 10,
      status: factors.newInquiries <= 1 ? 'Excellent' : factors.newInquiries <= 3 ? 'Good' : 'Poor',
      insight: `${factors.newInquiries} recent inquiries. Too many can temporarily lower your score.`,
    },
  ];
};

const generateLoanSuggestions = (userId, creditScore) => {
  const baseAmount = generateSeededNumber(userId, 200000, 2000000, 20);
  const suggestions = [];

  if (creditScore >= 750) {
    suggestions.push({
      id: `LOAN_${userId}_001`,
      type: 'Personal Loan',
      amount: Math.round(baseAmount * 0.5),
      interestRate: generateSeededFloat(userId, 7.5, 9.5, 1, 21),
      tenure: 60,
      recommendation: 'Recommended',
      color: '#27ae60',
      eligibilityScore: generateSeededNumber(userId, 90, 98, 22),
      aiNote: 'Based on your excellent payment history, you qualify for competitive rates.',
    });
  }

  if (creditScore >= 700) {
    suggestions.push({
      id: `LOAN_${userId}_002`,
      type: 'Home Loan',
      amount: Math.round(baseAmount * 1.5),
      interestRate: generateSeededFloat(userId, 6.0, 7.5, 1, 23),
      tenure: 240,
      recommendation: 'Available',
      color: '#f39c12',
      eligibilityScore: generateSeededNumber(userId, 80, 95, 24),
      aiNote: 'Your credit profile qualifies for home loans. Building more credit history will improve rates.',
    });
  }

  if (creditScore >= 650) {
    suggestions.push({
      id: `LOAN_${userId}_003`,
      type: 'Business Loan',
      amount: Math.round(baseAmount * 0.8),
      interestRate: generateSeededFloat(userId, 8.5, 11.0, 1, 25),
      tenure: 84,
      recommendation: 'Available',
      color: '#3498db',
      eligibilityScore: generateSeededNumber(userId, 70, 90, 26),
      aiNote: 'Business loan eligibility based on credit score and income stability.',
    });
  }

  return suggestions;
};

const generateRecentTransactions = (userId) => {
  const transactions = [];
  const now = new Date();

  for (let i = 0; i < 5; i++) {
    const daysAgo = generateSeededNumber(userId, 0, 30, 30 + i);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const types = ['Payment', 'Inquiry', 'Payment', 'Charge'];
    const type = types[generateSeededNumber(userId, 0, types.length - 1, 35 + i)];

    let amount = 0;
    let description = '';

    if (type === 'Payment') {
      amount = -generateSeededNumber(userId, 5000, 25000, 40 + i);
      description = generateTransactionDescription(userId, 'payment', 45 + i);
    } else if (type === 'Inquiry') {
      description = generateTransactionDescription(userId, 'inquiry', 50 + i);
    } else if (type === 'Charge') {
      amount = generateSeededNumber(userId, 1000, 15000, 55 + i);
      description = generateTransactionDescription(userId, 'charge', 60 + i);
    }

    transactions.push({
      id: `TXN_${userId}_${i + 1}`,
      type,
      description,
      amount,
      date: date.toISOString().split('T')[0],
      status: type === 'Inquiry' ? 'Pending' : 'Completed',
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Public API functions
export const getUserData = async (userId, user = {}) => {
  try {
    // First try to get from API if user is authenticated
    if (user && user.id && localStorage.getItem('token')) {
      try {
        const response = await axios.get('/users/dashboard');
        if (response.data.success) {
          // Store in localStorage for offline access
          await updateUserData(userId, response.data.data);
          return response.data.data;
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to localStorage:', apiError);
      }
    }

    // Try to get from localStorage
    const storageKey = getStorageKey(userId);
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === USER_DATA_VERSION) {
        return parsed.data;
      }
    }

    // Generate new data if not found or outdated
    const newData = await generateMockData(userId, user);
    await updateUserData(userId, newData);
    return newData;

  } catch (error) {
    console.error('Error getting user data:', error);
    return await generateMockData(userId, user);
  }
};

export const getUserCreditReportData = async (userId) => {
  try {
    // Try to get from localStorage first
    const storageKey = `${getStorageKey(userId)}_credit_report`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === USER_DATA_VERSION) {
        return parsed.data;
      }
    }

    // Generate new data if not found or outdated
    const newData = generateCreditReportData({ id: userId });
    localStorage.setItem(storageKey, JSON.stringify({
      version: USER_DATA_VERSION,
      timestamp: new Date().toISOString(),
      data: newData,
    }));
    return newData;

  } catch (error) {
    console.error('Error getting user credit report data:', error);
    return generateCreditReportData({ id: userId });
  }
};

export const getUserHistoryData = async (userId) => {
  try {
    // Try to get from localStorage first
    const storageKey = `${getStorageKey(userId)}_history`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === USER_DATA_VERSION) {
        return parsed.data;
      }
    }

    // Generate new data if not found or outdated
    const newData = generateHistoryData({ id: userId });
    localStorage.setItem(storageKey, JSON.stringify({
      version: USER_DATA_VERSION,
      timestamp: new Date().toISOString(),
      data: newData,
    }));
    return newData;

  } catch (error) {
    console.error('Error getting user history data:', error);
    return generateHistoryData({ id: userId });
  }
};

export const getUserImproveScoreData = async (userId) => {
  try {
    // Try to get from localStorage first
    const storageKey = `${getStorageKey(userId)}_improve_score`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === USER_DATA_VERSION) {
        return parsed.data;
      }
    }

    // Generate new data if not found or outdated
    const newData = generateImproveScoreData({ id: userId });
    localStorage.setItem(storageKey, JSON.stringify({
      version: USER_DATA_VERSION,
      timestamp: new Date().toISOString(),
      data: newData,
    }));
    return newData;

  } catch (error) {
    console.error('Error getting user improve score data:', error);
    return generateImproveScoreData({ id: userId });
  }
};

export const updateUserData = async (userId, newData) => {
  try {
    const storageKey = getStorageKey(userId);
    const dataToStore = {
      version: USER_DATA_VERSION,
      timestamp: new Date().toISOString(),
      data: newData,
    };

    localStorage.setItem(storageKey, JSON.stringify(dataToStore));

    // TODO: Also save to backend API if available
    // await saveToBackend(userId, newData);

    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

export const generateMockData = async (userId, user = {}) => {
  const factors = generateUserCreditFactors(userId);
  const creditScore = generateUserCreditScore(userId, factors);
  const previousScore = Math.max(300, creditScore - generateSeededNumber(userId, 5, 25, 70));

  return {
    user: generateUserProfile(userId, user),
    creditScore,
    scoreInsight: getScoreInsight(creditScore),
    previousScore,
    scoreHistory: generateScoreHistory(userId, creditScore),
    trend: creditScore > previousScore ? 'up' : creditScore < previousScore ? 'down' : 'stable',
    trendPercentage: Math.abs(((creditScore - previousScore) / previousScore) * 100).toFixed(1),

    creditFactors: generateCreditFactors(userId, factors),
    aiRecommendations: getAIRecommendations(creditScore, factors),
    loanSuggestions: generateLoanSuggestions(userId, creditScore),
    recentTransactions: generateRecentTransactions(userId),

    accountHealth: {
      score: generateSeededNumber(userId, 70, 95, 75),
      status: 'Healthy',
      lastUpdated: new Date().toISOString(),
      assessments: [
        { name: 'Payment Behavior', score: generateSeededNumber(userId, 80, 98, 76) },
        { name: 'Debt Management', score: generateSeededNumber(userId, 70, 90, 77) },
        { name: 'Credit Mix', score: generateSeededNumber(userId, 75, 95, 78) },
        { name: 'Inquiry Activity', score: generateSeededNumber(userId, 80, 98, 79) },
      ],
    },
  };
};

const generateScoreHistory = (userId, currentScore) => {
  const history = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentYear - (i > currentMonth ? 1 : 0);
    const monthName = months[monthIndex];

    // Generate a score that trends toward the current score
    const baseScore = Math.max(300, currentScore - generateSeededNumber(userId, 20, 100, 80 + i));
    const score = Math.min(900, Math.max(300, baseScore + generateSeededNumber(userId, -10, 10, 90 + i)));

    history.push({
      date: `${year}-${monthName}`,
      score: Math.round(score),
    });
  }

  return history;
};

// Legacy functions for backward compatibility
export const generateMockDashboardData = (user = null) => {
  const userId = generateUserId(user);
  return generateMockData(userId, user);
};

export const generateCreditReportData = (user = null) => {
  const userId = generateUserId(user);
  const factors = generateUserCreditFactors(userId);

  return {
    reportId: `RPT${userId.slice(-6).toUpperCase()}${Date.now().toString().slice(-6)}`,
    generatedDate: new Date().toISOString(),
    accountsSummary: {
      totalAccounts: generateSeededNumber(userId, 3, 12, 100),
      activeAccounts: generateSeededNumber(userId, 2, 10, 101),
      closedAccounts: generateSeededNumber(userId, 0, 3, 102),
      delinquentAccounts: generateSeededNumber(userId, 0, 1, 103),
    },
    accountDetails: generateAccountDetails(userId),
    inquiries: generateInquiries(userId),
  };
};

const generateAccountDetails = (userId) => {
  const accounts = [];
  const accountTypes = [
    { type: 'Credit Card', issuer: 'HDFC Bank' },
    { type: 'Credit Card', issuer: 'ICICI Bank' },
    { type: 'Auto Loan', issuer: 'SBI' },
    { type: 'Personal Loan', issuer: 'Axis Bank' },
  ];

  const numAccounts = generateSeededNumber(userId, 2, 6, 110);

  for (let i = 0; i < numAccounts; i++) {
    const accountType = accountTypes[generateSeededNumber(userId, 0, accountTypes.length - 1, 115 + i)];
    const isActive = generateSeededNumber(userId, 0, 10, 120 + i) > 1; // 90% active

    let accountData = {
      id: `ACC_${userId}_${i + 1}`,
      type: accountType.type,
      issuer: accountType.issuer,
      accountNumber: generateAccountNumber(userId, 125 + i),
      status: isActive ? 'Active' : 'Closed',
    };

    if (accountType.type === 'Credit Card') {
      accountData = {
        ...accountData,
        creditLimit: generateSeededNumber(userId, 50000, 500000, 130 + i),
        currentBalance: generateSeededNumber(userId, 0, 100000, 135 + i),
        paymentStatus: 'Current',
        openDate: new Date(Date.now() - generateSeededNumber(userId, 365, 2555, 140 + i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    } else {
      accountData = {
        ...accountData,
        loanAmount: generateSeededNumber(userId, 100000, 2000000, 145 + i),
        currentBalance: generateSeededNumber(userId, 0, 1000000, 150 + i),
        monthlyPayment: generateSeededNumber(userId, 5000, 50000, 155 + i),
        paymentStatus: 'Current',
        openDate: new Date(Date.now() - generateSeededNumber(userId, 365, 2555, 160 + i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    }

    accounts.push(accountData);
  }

  return accounts;
};

const generateInquiries = (userId) => {
  const inquiries = [];
  const numInquiries = generateSeededNumber(userId, 0, 4, 170);

  for (let i = 0; i < numInquiries; i++) {
    const daysAgo = generateSeededNumber(userId, 1, 180, 175 + i);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    inquiries.push({
      type: generateSeededNumber(userId, 0, 1, 180 + i) === 0 ? 'Hard Inquiry' : 'Soft Inquiry',
      date: date.toISOString().split('T')[0],
      lender: ['XYZ Bank', 'ABC Finance', 'Credit Bureau', 'DEF Loans'][generateSeededNumber(userId, 0, 3, 185 + i)],
      purpose: ['Personal Loan', 'Credit Card', 'Car Loan', 'Home Loan'][generateSeededNumber(userId, 0, 3, 190 + i)] + ' Application',
    });
  }

  return inquiries.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const generateHistoryData = (user = null) => {
  const userId = generateUserId(user);
  const currentScore = generateSeededNumber(userId, 650, 800, 200);

  return {
    scoreHistory: generateScoreHistory(userId, currentScore).map(item => ({
      month: item.date,
      score: item.score,
      recommendation: getScoreRecommendation(item.score),
    })),
    milestones: generateMilestones(userId),
  };
};

const getScoreRecommendation = (score) => {
  if (score >= 800) return 'Excellent - Maintain current practices';
  if (score >= 740) return 'Very Good - On track for 800+';
  if (score >= 670) return 'Good - Room for improvement';
  if (score >= 580) return 'Fair - Focus on key factors';
  return 'Poor - Immediate attention needed';
};

const generateMilestones = (userId) => {
  const milestones = [];
  const possibleMilestones = [
    { achievement: 'Reached 700+ score', reward: '🎯' },
    { achievement: 'Reached 750+ score', reward: '⭐' },
    { achievement: 'Maintained 740+ for 3 months', reward: '🏆' },
    { achievement: 'Zero late payments for 6 months', reward: '✅' },
    { achievement: 'Reduced utilization below 30%', reward: '💳' },
  ];

  const numMilestones = generateSeededNumber(userId, 1, 4, 210);

  for (let i = 0; i < numMilestones; i++) {
    const milestone = possibleMilestones[generateSeededNumber(userId, 0, possibleMilestones.length - 1, 215 + i)];
    const daysAgo = generateSeededNumber(userId, 30, 365, 220 + i);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    milestones.push({
      date: date.toISOString().split('T')[0],
      achievement: milestone.achievement,
      reward: milestone.reward,
    });
  }

  return milestones.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const generateImproveScoreData = (user = null) => {
  const userId = generateUserId(user);
  const currentScore = generateSeededNumber(userId, 650, 800, 230);
  const targetScore = 800;

  return {
    currentScore,
    targetScore,
    recommendations: generateRecommendations(userId, currentScore),
    successStories: [
      {
        name: generateUserName(userId + '_success1'),
        initialScore: currentScore - generateSeededNumber(userId, 50, 150, 240),
        currentScore,
        timeframe: `${generateSeededNumber(userId, 6, 24, 245)} months`,
        story: 'By consistently paying bills on time and reducing credit utilization, this user improved their score significantly.',
      },
      {
        name: generateUserName(userId + '_success2'),
        initialScore: currentScore - generateSeededNumber(userId, 30, 100, 250),
        currentScore,
        timeframe: `${generateSeededNumber(userId, 8, 18, 255)} months`,
        story: 'This user focused on building credit history diversity and maintaining perfect payment records.',
      },
    ],
  };
};

const generateRecommendations = (userId, currentScore) => {
  const recommendations = [];

  // Always include payment history recommendation
  recommendations.push({
    id: `REC_${userId}_001`,
    priority: 'High',
    title: 'Maintain Zero Late Payments',
    description: 'Continue your excellent track record of on-time payments. This has the biggest impact on your score.',
    estimatedImpact: '+0-5 points (Maintenance)',
    timeframe: 'Immediate',
    difficulty: 'Easy',
    icon: '✅',
    aiReasoning: 'Your payment history is a key factor. Maintaining perfection is crucial.',
  });

  // Utilization recommendation if score is not excellent
  if (currentScore < 800) {
    const utilization = generateSeededNumber(userId, 20, 80, 260);
    recommendations.push({
      id: `REC_${userId}_002`,
      priority: utilization > 40 ? 'High' : 'Medium',
      title: `Keep Credit Utilization Below ${utilization > 40 ? '30%' : '20%'}`,
      description: `Your current utilization is ${utilization}%. Aim for below ${utilization > 40 ? '30%' : '20%'} for optimal score.`,
      estimatedImpact: '+10-20 points',
      timeframe: '2-3 months',
      difficulty: utilization > 40 ? 'Medium' : 'Easy',
      icon: '💳',
      aiReasoning: 'Every 10% reduction in utilization can add 5-10 points to your score.',
      actionItems: [
        `Pay down credit card balances by ₹${generateSeededNumber(userId, 20000, 100000, 265)}`,
        'Request credit limit increase from your bank',
        'Distribute balances across multiple cards',
      ],
    });
  }

  // Credit mix recommendation
  if (generateSeededNumber(userId, 0, 1, 270) === 1) {
    recommendations.push({
      id: `REC_${userId}_003`,
      priority: 'Low',
      title: 'Build Diverse Credit Mix',
      description: 'Consider adding a new type of credit account to diversify your portfolio.',
      estimatedImpact: '+5-15 points',
      timeframe: '6-12 months',
      difficulty: 'Hard',
      icon: '🔄',
      aiReasoning: 'A diverse credit mix helps improve your overall credit profile.',
      actionItems: [
        'Apply for a personal loan (after 6 months of current practices)',
        'Consider secured credit card if needed',
        'Do not apply too frequently to avoid hard inquiries',
      ],
    });
  }

  // Monitoring recommendation
  recommendations.push({
    id: `REC_${userId}_004`,
    priority: 'Medium',
    title: 'Monitor Credit Report Quarterly',
    description: 'Regular monitoring helps catch errors and fraud early.',
    estimatedImpact: '+0-10 points (Error correction)',
    timeframe: 'Ongoing',
    difficulty: 'Easy',
    icon: '📊',
    aiReasoning: 'Errors on credit reports can unfairly lower your score. Regular checks are important.',
    actionItems: [
      'Check credit report every 3 months',
      'Dispute any inaccuracies immediately',
      'Use credit monitoring services',
    ],
  });

  return recommendations;
};

