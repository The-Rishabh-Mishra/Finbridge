// Credit Score Calculation Rules
// Score Range: 300 - 900

export const SCORING_RULES = {
  // Base weights for different factors
  factors: {
    paymentHistory: {
      weight: 0.35,
      minScore: 300,
      maxScore: 900,
      description: 'Payment History (35%)',
    },
    creditUtilization: {
      weight: 0.30,
      minScore: 300,
      maxScore: 900,
      description: 'Credit Utilization (30%)',
    },
    historyLength: {
      weight: 0.15,
      minScore: 300,
      maxScore: 900,
      description: 'Length of Credit History (15%)',
    },
    creditMix: {
      weight: 0.10,
      minScore: 300,
      maxScore: 900,
      description: 'Credit Mix (10%)',
    },
    newCredit: {
      weight: 0.10,
      minScore: 300,
      maxScore: 900,
      description: 'New Credit (10%)',
    },
  },

  // Score categories
  scoreCategories: {
    excellent: { min: 750, max: 900, label: 'Excellent' },
    good: { min: 650, max: 749, label: 'Good' },
    fair: { min: 550, max: 649, label: 'Fair' },
    poor: { min: 300, max: 549, label: 'Poor' },
  },

  // Penalty rules
  penalties: {
    missedPayment: -50,
    highUtilization: -30,
    newInquiry: -5,
    closedAccount: -15,
    collection: -100,
    bankruptcy: -200,
  },

  // Reward rules
  rewards: {
    onTimePayment: 10,
    lowUtilization: 20,
    oldAccount: 25,
    diverseCredit: 15,
  },
};

export function calculateScoreFactors(userData) {
  const factors = {
    paymentHistory: calculatePaymentHistory(userData.paymentHistory),
    creditUtilization: calculateCreditUtilization(userData.creditUtilization),
    historyLength: calculateHistoryLength(userData.historyLength),
    creditMix: calculateCreditMix(userData.creditMix),
    newCredit: calculateNewCredit(userData.newCredit),
  };

  return factors;
}

function calculatePaymentHistory(data) {
  let score = 900;
  const missedPayments = data?.missedPayments || 0;
  score -= missedPayments * SCORING_RULES.penalties.missedPayment;
  return Math.max(score, 300);
}

function calculateCreditUtilization(utilization) {
  const ratio = (utilization || 0) / 100;
  if (ratio <= 0.3) return 900;
  if (ratio <= 0.5) return 800;
  if (ratio <= 0.7) return 700;
  return 600;
}

function calculateHistoryLength(months) {
  const years = (months || 0) / 12;
  if (years >= 20) return 900;
  if (years >= 10) return 800;
  if (years >= 5) return 700;
  if (years >= 2) return 600;
  return 300;
}

function calculateCreditMix(mix) {
  const types = mix || {};
  let score = 300;
  if (types.creditCard) score += 150;
  if (types.autoLoan) score += 150;
  if (types.homeLoan) score += 150;
  if (types.personalLoan) score += 150;
  return Math.min(score, 900);
}

function calculateNewCredit(inquiries) {
  let score = 900;
  score -= (inquiries || 0) * SCORING_RULES.penalties.newInquiry;
  return Math.max(score, 300);
}

