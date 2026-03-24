/**
 * AI-Powered Credit Score Insights and Analysis
 * This module provides intelligent recommendations based on credit profile
 */

export const creditScoreFactors = {
  paymentHistory: {
    weight: 35,
    description: 'On-time payment history (35%)',
    aiInsight: 'Payment history is the most critical factor. AI analysis shows consistent on-time payments improve creditworthiness significantly.',
  },
  creditUtilization: {
    weight: 30,
    description: 'Credit utilization ratio (30%)',
    aiInsight: 'Keeping utilization below 30% signals responsible credit management to lenders.',
  },
  creditHistory: {
    weight: 15,
    description: 'Length of credit history (15%)',
    aiInsight: 'Longer credit history provides more data for AI algorithms to assess reliability.',
  },
  creditMix: {
    weight: 10,
    description: 'Mix of credit types (10%)',
    aiInsight: 'Diverse credit portfolio (cards, loans) demonstrates ability to handle different credit types.',
  },
  newCreditInquiries: {
    weight: 10,
    description: 'New credit inquiries (10%)',
    aiInsight: 'Multiple hard inquiries in short periods may indicate financial stress.',
  },
};

export const getAIRecommendations = (creditScore, factors) => {
  const recommendations = [];

  if (creditScore < 600) {
    recommendations.push({
      priority: 'Critical',
      title: '🚨 Immediate Action Required',
      description: 'Your credit score is in the poor range. Focus on paying down debt and avoiding missed payments.',
      estimatedImpact: '+50-100 points in 6 months',
      actions: [
        'Pay all bills on time for the next 6 months',
        'Reduce credit card balances by at least 50%',
        'Dispute any inaccurate items on your credit report',
      ],
    });
  }

  if (factors?.paymentHistory < 80) {
    recommendations.push({
      priority: 'High',
      title: '💳 Improve Payment History',
      description: 'Late or missed payments are severely impacting your score.',
      estimatedImpact: '+40-80 points in 3 months',
      actions: [
        'Set up automatic payments for all bills',
        'Negotiate payment plans for past-due accounts',
        'Contact creditors to remove negative marks',
      ],
    });
  }

  if (factors?.creditUtilization > 50) {
    recommendations.push({
      priority: 'High',
      title: '💰 Reduce Credit Utilization',
      description: 'Your credit card balances are too high relative to limits.',
      estimatedImpact: '+20-50 points immediately',
      actions: [
        'Pay down credit card balances',
        'Request credit limit increases',
        'Spread balances across multiple cards',
      ],
    });
  }

  if (factors?.creditHistory > 0 && factors?.creditHistory < 2) {
    recommendations.push({
      priority: 'Medium',
      title: '⏳ Build Credit History',
      description: 'You have limited credit history. Building it takes time and consistency.',
      estimatedImpact: '+10-30 points annually',
      actions: [
        'Keep old accounts open',
        'Maintain diverse credit types',
        'Become an authorized user on established accounts',
      ],
    });
  }

  if (creditScore >= 750) {
    recommendations.push({
      priority: 'Maintenance',
      title: '✨ Excellent Credit Score',
      description: 'You have excellent credit! Focus on maintaining these practices.',
      estimatedImpact: 'Maintain 750+ score',
      actions: [
        'Continue paying bills on time',
        'Keep credit utilization low',
        'Monitor your credit report regularly',
      ],
    });
  }

  return recommendations;
};

export const getScoreInsight = (score) => {
  if (score >= 800) {
    return {
      category: 'Excellent',
      color: '#27ae60',
      description: 'Outstanding credit profile. You qualify for the best rates and terms.',
      loanEligibility: 'Eligible for premium products with lowest rates',
    };
  } else if (score >= 750) {
    return {
      category: 'Very Good',
      color: '#2ecc71',
      description: 'Strong credit profile. You qualify for favorable terms.',
      loanEligibility: 'Eligible for most premium products',
    };
  } else if (score >= 700) {
    return {
      category: 'Good',
      color: '#f39c12',
      description: 'Decent credit profile. Lenders view you as acceptable risk.',
      loanEligibility: 'Eligible for standard products',
    };
  } else if (score >= 650) {
    return {
      category: 'Fair',
      color: '#e67e22',
      description: 'Your credit is acceptable but could use improvement.',
      loanEligibility: 'Limited product eligibility, may need guarantor',
    };
  } else {
    return {
      category: 'Poor',
      color: '#e74c3c',
      description: 'Your credit needs significant improvement.',
      loanEligibility: 'Limited eligibility, higher interest rates',
    };
  }
};

