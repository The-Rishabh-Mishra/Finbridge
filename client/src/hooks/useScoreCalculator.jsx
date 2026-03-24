import { useState, useCallback } from 'react';

export function useScoreCalculator() {
  const [score, setScore] = useState(300);

  const calculateScore = useCallback((factors) => {
    const {
      paymentHistory = 0,
      creditUtilization = 0,
      historyLength = 0,
      creditMix = 0,
      newCredit = 0,
    } = factors;

    const calculatedScore =
      300 +
      paymentHistory * 2.1 +
      creditUtilization * 2.1 +
      historyLength * 1.05 +
      creditMix * 0.7 +
      newCredit * 0.7;

    const finalScore = Math.min(Math.max(calculatedScore, 300), 900);
    setScore(finalScore);
    return finalScore;
  }, []);

  return { score, calculateScore };
}

