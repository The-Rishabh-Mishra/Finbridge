import React from 'react';

export default function ScoreCard({ score, scoreInsight, previousScore, trend, trendPercentage }) {
  const insight = scoreInsight || {
    category: score >= 750 ? 'Excellent' : score >= 650 ? 'Good' : 'Fair',
    color: score >= 750 ? '#27ae60' : score >= 650 ? '#f39c12' : '#e74c3c',
    description: 'Your credit profile is being analyzed',
    loanEligibility: 'Check back for updates',
  };

  return (
    <div className="score-card ai-enhanced">
      <div className="score-display">
        <div className="score-circle" style={{ borderColor: insight.color, boxShadow: `0 0 20px ${insight.color}40` }}>
          <span className="score-value">{score}</span>
          <span className="score-label">/ 900</span>
        </div>
        {trend && (
          <div className="trend-indicator" style={{ color: trend === 'up' ? '#27ae60' : '#e74c3c' }}>
            {trend === 'up' ? '📈' : '📉'} {trendPercentage}%
          </div>
        )}
      </div>

      <div className="score-info">
        <div className="score-header">
          <h3>Credit Score</h3>
          <span className="score-category" style={{ backgroundColor: insight.color }}>
            {insight.category}
          </span>
        </div>

        <p className="score-description">{insight.description}</p>

        {previousScore && (
          <div className="score-comparison">
            <div className="comparison-item">
              <span className="label">Previous</span>
              <span className="value">{previousScore}</span>
            </div>
            <div className="comparison-arrow">→</div>
            <div className="comparison-item">
              <span className="label">Current</span>
              <span className="value" style={{ color: insight.color }}>{score}</span>
            </div>
          </div>
        )}

        <div className="score-insight">
          <h4>💡 AI Insight</h4>
          <p>{insight.loanEligibility}</p>
        </div>

        <div className="score-action">
          <button className="btn-secondary">View Detailed Analysis</button>
        </div>
      </div>
    </div>
  );
}

