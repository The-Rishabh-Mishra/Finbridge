/**
 * Mock Data Service with AI-Powered Models
 * Provides realistic credit data with AI insights and recommendations
 */

import { getAIRecommendations, getScoreInsight } from './aiInsights.js';

export const generateMockDashboardData = () => {
  const creditScore = 745;
  const factors = {
    paymentHistory: 92,
    creditUtilization: 28,
    creditHistory: 3.5,
    creditMix: 8,
    newInquiries: 1,
  };

  return {
    user: {
      id: 'USR123456',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210',
      createdAt: '2022-01-15',
      isActive: true,
      profileCompleted: 95,
    },
    creditScore: creditScore,
    scoreInsight: getScoreInsight(creditScore),
    previousScore: 720,
    scoreHistory: [
      { date: '2024-11', score: 720 },
      { date: '2024-12', score: 735 },
      { date: '2025-01', score: 745 },
    ],
    trend: 'up',
    trendPercentage: 3.5,
    
    // AI-Powered Credit Factors
    creditFactors: [
      {
        name: 'Payment History',
        percentage: factors.paymentHistory,
        weight: 35,
        status: 'Excellent',
        insight: 'You have consistently made on-time payments. This is excellent!',
      },
      {
        name: 'Credit Utilization',
        percentage: factors.creditUtilization,
        weight: 30,
        status: 'Excellent',
        insight: 'Your credit card utilization is well below the recommended 30% threshold.',
      },
      {
        name: 'Credit History',
        percentage: (factors.creditHistory / 10) * 100,
        weight: 15,
        status: 'Good',
        insight: 'Your 3.5 years of credit history is solid. More history will boost your score.',
      },
      {
        name: 'Credit Mix',
        percentage: factors.creditMix * 10,
        weight: 10,
        status: 'Good',
        insight: 'You have a healthy mix of credit types (credit cards and installment loans).',
      },
      {
        name: 'New Inquiries',
        percentage: Math.max(0, 100 - factors.newInquiries * 10),
        weight: 10,
        status: 'Excellent',
        insight: 'Minimal hard inquiries show responsible credit seeking behavior.',
      },
    ],

    aiRecommendations: getAIRecommendations(creditScore, factors),

    loanSuggestions: [
      {
        id: 'LOAN001',
        type: 'Personal Loan',
        amount: 500000,
        interestRate: 8.5,
        tenure: 60,
        recommendation: 'Recommended',
        color: '#27ae60',
        eligibilityScore: 95,
        aiNote: 'Based on your excellent payment history, you qualify for competitive rates.',
      },
      {
        id: 'LOAN002',
        type: 'Home Loan',
        amount: 2000000,
        interestRate: 6.5,
        tenure: 240,
        recommendation: 'Available',
        color: '#f39c12',
        eligibilityScore: 88,
        aiNote: 'Your credit profile qualifies for home loans. Building more credit history will improve rates.',
      },
      {
        id: 'LOAN003',
        type: 'Business Loan',
        amount: 1000000,
        interestRate: 9.5,
        tenure: 84,
        recommendation: 'Available',
        color: '#3498db',
        eligibilityScore: 82,
        aiNote: 'Business loan eligibility based on credit score and income stability.',
      },
    ],

    recentTransactions: [
      {
        id: 'TXN001',
        type: 'Payment',
        description: 'Credit Card Payment - HDFC',
        amount: -15000,
        date: '2025-01-03',
        status: 'Completed',
      },
      {
        id: 'TXN002',
        type: 'Inquiry',
        description: 'Personal Loan Application',
        amount: 0,
        date: '2025-01-02',
        status: 'Pending',
      },
      {
        id: 'TXN003',
        type: 'Payment',
        description: 'EMI Payment - Car Loan',
        amount: -8500,
        date: '2025-01-01',
        status: 'Completed',
      },
    ],

    accountHealth: {
      score: 85,
      status: 'Healthy',
      lastUpdated: new Date().toISOString(),
      assessments: [
        { name: 'Payment Behavior', score: 95 },
        { name: 'Debt Management', score: 78 },
        { name: 'Credit Mix', score: 80 },
        { name: 'Inquiry Activity', score: 88 },
      ],
    },
  };
};

export const generateCreditReportData = () => {
  return {
    reportId: 'RPT20250105001',
    generatedDate: new Date().toISOString(),
    accountsSummary: {
      totalAccounts: 8,
      activeAccounts: 7,
      closedAccounts: 1,
      delinquentAccounts: 0,
    },
    accountDetails: [
      {
        id: 'ACC001',
        type: 'Credit Card',
        issuer: 'HDFC Bank',
        accountNumber: '****1234',
        status: 'Active',
        creditLimit: 500000,
        currentBalance: 145000,
        paymentStatus: 'Current',
        openDate: '2020-03-15',
      },
      {
        id: 'ACC002',
        type: 'Auto Loan',
        issuer: 'ICICI Bank',
        accountNumber: '****5678',
        status: 'Active',
        loanAmount: 800000,
        currentBalance: 320000,
        monthlyPayment: 8500,
        paymentStatus: 'Current',
        openDate: '2022-08-20',
      },
      {
        id: 'ACC003',
        type: 'Credit Card',
        issuer: 'Axis Bank',
        accountNumber: '****9012',
        status: 'Active',
        creditLimit: 300000,
        currentBalance: 42000,
        paymentStatus: 'Current',
        openDate: '2021-06-10',
      },
    ],
    inquiries: [
      {
        type: 'Hard Inquiry',
        date: '2025-01-02',
        lender: 'XYZ Bank',
        purpose: 'Personal Loan Application',
      },
      {
        type: 'Soft Inquiry',
        date: '2024-12-15',
        lender: 'Credit Bureau',
        purpose: 'Credit Monitoring',
      },
    ],
  };
};

export const generateHistoryData = () => {
  return {
    scoreHistory: [
      { month: 'Jan 2024', score: 680, recommendation: 'Fair - Room for improvement' },
      { month: 'Feb 2024', score: 695, recommendation: 'Fair - Paying bills on time' },
      { month: 'Mar 2024', score: 710, recommendation: 'Good - Keep up the effort' },
      { month: 'Apr 2024', score: 705, recommendation: 'Good - Reduce utilization' },
      { month: 'May 2024', score: 720, recommendation: 'Good - Consistent improvement' },
      { month: 'Jun 2024', score: 715, recommendation: 'Good - Maintain practices' },
      { month: 'Jul 2024', score: 730, recommendation: 'Good - Excellent progress' },
      { month: 'Aug 2024', score: 740, recommendation: 'Very Good - Target 750+' },
      { month: 'Sep 2024', score: 735, recommendation: 'Very Good - Minor setback' },
      { month: 'Oct 2024', score: 742, recommendation: 'Very Good - On track' },
      { month: 'Nov 2024', score: 745, recommendation: 'Very Good - Excellent' },
      { month: 'Dec 2024', score: 745, recommendation: 'Very Good - Stable' },
    ],
    milestones: [
      { date: '2024-03-15', achievement: 'Reached 700+ score', reward: '🎯' },
      { date: '2024-07-20', achievement: 'Reached 730+ score', reward: '⭐' },
      { date: '2024-11-10', achievement: 'Maintained 740+ for 3 months', reward: '🏆' },
    ],
  };
};

export const generateImproveScoreData = () => {
  return {
    currentScore: 745,
    targetScore: 800,
    recommendations: [
      {
        id: 'REC001',
        priority: 'High',
        title: 'Maintain Zero Late Payments',
        description: 'Continue your excellent track record of on-time payments. This has the biggest impact on your score.',
        estimatedImpact: '+0-5 points (Maintenance)',
        timeframe: 'Immediate',
        difficulty: 'Easy',
        icon: '✅',
        aiReasoning: 'Your payment history is 92/100. Maintaining perfection is key to reaching 800+.',
      },
      {
        id: 'REC002',
        priority: 'Medium',
        title: 'Keep Credit Utilization Below 20%',
        description: 'Your current utilization is 28%. Aim for below 20% for optimal score.',
        estimatedImpact: '+10-20 points',
        timeframe: '2-3 months',
        difficulty: 'Medium',
        icon: '💳',
        aiReasoning: 'Every 10% reduction in utilization can add 5-10 points to your score.',
        actionItems: [
          'Pay down credit card balances by $50,000',
          'Request credit limit increase from HDFC Bank',
          'Distribute balances across multiple cards',
        ],
      },
      {
        id: 'REC003',
        priority: 'Low',
        title: 'Build Diverse Credit Mix',
        description: 'Consider adding a new type of credit account to diversify your portfolio.',
        estimatedImpact: '+5-15 points',
        timeframe: '6-12 months',
        difficulty: 'Hard',
        icon: '🔄',
        aiReasoning: 'You currently have 8/10 credit mix score. Adding different account types helps.',
        actionItems: [
          'Apply for a personal loan (after 6 months of current practices)',
          'Consider secured credit card if needed',
          'Do not apply too frequently to avoid hard inquiries',
        ],
      },
      {
        id: 'REC004',
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
      },
    ],
    successStories: [
      {
        name: 'Rajesh Kumar',
        initialScore: 620,
        currentScore: 780,
        timeframe: '18 months',
        story: 'By consistently paying bills on time and reducing credit utilization, Rajesh improved his score by 160 points.',
      },
      {
        name: 'Priya Sharma',
        initialScore: 700,
        currentScore: 820,
        timeframe: '24 months',
        story: 'Priya focused on building credit history diversity and maintaining perfect payment records.',
      },
    ],
  };
};

