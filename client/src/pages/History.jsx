import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../components/InfoModal';
import { generateHistoryData } from '../utils/mockDataService.js';
import '../styles/history.css';

export default function History() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockHistory = generateHistoryData();
        setHistory(mockHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your score history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <div className="header-content">
            <h1>📈 Score History & Trends</h1>
            <p className="subtitle">Your credit score progress over the past 12 months</p>
            <div className="history-actions">
              <button className="history-btn btn-primary" onClick={() => alert('📊 Exporting your history data...\n✅ Download will start shortly!')}>
                📊 Export Data
              </button>
              <button className="history-btn btn-secondary" onClick={() => navigate('/credit-report')}>
                📋 View Full Report
              </button>
              <button className="history-btn btn-secondary" onClick={() => alert('📧 History data shared via email!\n✅ Check your inbox')}>
                📤 Share History
              </button>
            </div>
          </div>
          <InfoModal
            title="Understanding Score History"
            icon="📊"
            description="Your score history shows how your credit score has changed over time. Tracking trends helps you understand the impact of your financial decisions and identify patterns."
            features={[
              "Monthly score updates reflecting your credit activity",
              "Trends showing improvement or decline",
              "Milestones marking significant achievements",
              "Correlation between actions and score changes",
              "Recommendations tied to historical performance"
            ]}
          />
        </div>

        {/* Score Trend Chart */}
        <div className="history-card trend-chart">
          <div className="card-header">
            <h2>Score Trend (12 Months)</h2>
            <InfoModal
              title="Reading Your Trend"
              icon="📉"
              description="This chart visualizes your score changes over 12 months. An upward trend indicates improving credit health through better financial management."
              features={[
                "Each point represents your score for that month",
                "Upward trend = Positive financial behavior",
                "Downward trend = Areas needing improvement",
                "Flat line = Stable credit profile",
                "Sharp changes = Recent major financial events"
              ]}
            />
          </div>
          <div className="chart-container">
            <div className="chart-grid">
              {history?.scoreHistory?.map((entry, index) => (
                <div key={index} className="chart-bar-wrapper">
                  <div 
                    className="chart-bar"
                    style={{
                      height: `${(entry.score / 900) * 100}%`,
                      backgroundColor: entry.score >= 750 ? '#27ae60' : entry.score >= 650 ? '#f39c12' : '#e74c3c'
                    }}
                    title={`${entry.month}: ${entry.score}`}
                  >
                    <span className="bar-label">{entry.score}</span>
                  </div>
                  <span className="bar-month">{entry.month}</span>
                </div>
              ))}
            </div>
            <div className="chart-y-axis">
              <span>900</span>
              <span>750</span>
              <span>600</span>
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Detailed History */}
        <div className="history-card detailed-history">
          <div className="card-header">
            <h2>Detailed Monthly Breakdown</h2>
            <InfoModal
              title="Monthly Breakdown Details"
              icon="📅"
              description="See what happened each month and recommendations for each period. Understanding the reasons behind score changes helps you make better financial decisions."
              features={[
                "Monthly score with previous month comparison",
                "Score change direction and amount",
                "AI recommendations for that period",
                "Pattern recognition across months",
                "Key events affecting your score"
              ]}
            />
          </div>
          <div className="history-list">
            {history?.scoreHistory?.map((entry, index) => (
              <div key={index} className="history-item">
                <div className="history-month">
                  <span className="month-name">{entry.month}</span>
                </div>
                <div className="history-score">
                  <span className="score-value">{entry.score}</span>
                  <span className="score-label">/ 900</span>
                </div>
                <div className="history-info">
                  <div className="recommendation">
                    <span className="rec-label">Insight:</span>
                    <span className="rec-text">{entry.recommendation}</span>
                  </div>
                </div>
                <div className="history-status">
                  {entry.score >= 750 && <span className="badge excellent">Excellent</span>}
                  {entry.score >= 700 && entry.score < 750 && <span className="badge good">Very Good</span>}
                  {entry.score >= 650 && entry.score < 700 && <span className="badge fair">Good</span>}
                  {entry.score < 650 && <span className="badge poor">Fair</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        {history?.milestones && history.milestones.length > 0 && (
          <div className="history-card milestones">
            <div className="card-header">
              <h2>🏆 Achievements & Milestones</h2>
              <InfoModal
                title="Celebrating Progress"
                icon="🎯"
                description="Milestones mark significant achievements in your credit journey. Each milestone represents important progress in building your credit health."
                features={[
                  "Score milestones at key thresholds (700, 750, 800)",
                  "Consistency rewards (maintaining score for months)",
                  "Improvement achievements (major score jumps)",
                  "Completion of recommended actions",
                  "Special recognitions for financial discipline"
                ]}
              />
            </div>
            <div className="milestones-timeline">
              {history?.milestones?.map((milestone, index) => (
                <div key={index} className="milestone-item">
                  <div className="milestone-marker">{milestone.reward}</div>
                  <div className="milestone-content">
                    <h3>{milestone.achievement}</h3>
                    <p className="milestone-date">{new Date(milestone.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="insights-section">
          <h3>💡 Key Insights from Your History</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <span className="insight-icon">📈</span>
              <h4>Overall Trend</h4>
              <p>Your score has shown consistent improvement over the past 12 months, reflecting positive financial behavior.</p>
            </div>
            <div className="insight-card">
              <span className="insight-icon">⚡</span>
              <h4>Growth Rate</h4>
              <p>Average monthly improvement of 6-8 points, indicating sustainable credit building.</p>
            </div>
            <div className="insight-card">
              <span className="insight-icon">🎯</span>
              <h4>Next Goal</h4>
              <p>You're on track to reach 800+ by maintaining current practices for the next 6 months.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

