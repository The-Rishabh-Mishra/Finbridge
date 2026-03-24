import { SCORING_RULES, calculateScoreFactors } from '../config/scoringRules.js';

export function calculateCreditScore(userData) {
  try {
    const factors = calculateScoreFactors(userData);

    const score =
      factors.paymentHistory * SCORING_RULES.factors.paymentHistory.weight +
      factors.creditUtilization * SCORING_RULES.factors.creditUtilization.weight +
      factors.historyLength * SCORING_RULES.factors.historyLength.weight +
      factors.creditMix * SCORING_RULES.factors.creditMix.weight +
      factors.newCredit * SCORING_RULES.factors.newCredit.weight;

    const finalScore = Math.min(Math.max(Math.round(score), 300), 900);
    return finalScore;
  } catch (error) {
    console.error('Error calculating credit score:', error);
    return 300;
  }
}

export function getScoreCategory(score) {
  const { scoreCategories } = SCORING_RULES;
  for (const [key, category] of Object.entries(scoreCategories)) {
    if (score >= category.min && score <= category.max) {
      return category.label;
    }
  }
  return 'Unknown';
}

export function getScorePercentile(score) {
  return Math.round(((score - 300) / 600) * 100);
}

export function getScoreRecommendations(score, userData) {
  const recommendations = [];

  if (userData.paymentHistory?.missedPayments > 0) {
    recommendations.push('Focus on making all payments on time');
  }

  if (userData.creditUtilization > 50) {
    recommendations.push('Reduce credit utilization below 30%');
  }

  if (!userData.creditMix?.homeLoan && !userData.creditMix?.autoLoan) {
    recommendations.push('Diversify your credit mix with different types of credit');
  }

  if (score < 650) {
    recommendations.push('Consider fixing negative items in your credit report');
  }

  return recommendations;
}

