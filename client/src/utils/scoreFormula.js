// Credit Score Calculation Formula
// Score Range: 300 - 900

const SCORE_FACTORS = {
  paymentHistory: 0.35,      // 35% weight
  creditUtilization: 0.30,   // 30% weight
  historyLength: 0.15,       // 15% weight
  creditMix: 0.10,           // 10% weight
  newCredit: 0.10,           // 10% weight
};

export function calculateCreditScore(factors) {
  const {
    paymentHistory = 300,
    creditUtilization = 300,
    historyLength = 300,
    creditMix = 300,
    newCredit = 300,
  } = factors;

  const score =
    paymentHistory * SCORE_FACTORS.paymentHistory +
    creditUtilization * SCORE_FACTORS.creditUtilization +
    historyLength * SCORE_FACTORS.historyLength +
    creditMix * SCORE_FACTORS.creditMix +
    newCredit * SCORE_FACTORS.newCredit;

  return Math.min(Math.max(Math.round(score), 300), 900);
}

export function getScoreRange(score) {
  if (score >= 750) return 'Excellent';
  if (score >= 650) return 'Good';
  if (score >= 550) return 'Fair';
  return 'Poor';
}

export function getScorePercentile(score) {
  return ((score - 300) / 600) * 100;
}

