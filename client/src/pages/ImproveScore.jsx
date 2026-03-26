import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import InfoModal from '../components/InfoModal';
import { getUserImproveScoreData, generateImproveScoreData } from '../utils/mockDataService.js';
import '../styles/improve-score.css';

export default function ImproveScore() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRec, setExpandedRec] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedLoan] = useState(location.state?.selectedLoan || null);

  useEffect(() => {
    const fetchImproveScoreData = async () => {
      try {
        setLoading(true);

        if (user) {
          // Get user-specific improve score data
          const userImproveData = await getUserImproveScoreData(user.id || user.email);
          setData(userImproveData);
        } else {
          // Fallback for anonymous users
          const mockData = generateImproveScoreData();
          setData(mockData);
        }
      } catch (error) {
        console.error('Error fetching improve score data:', error);
        // Fallback to mock data on error
        const mockData = generateImproveScoreData(user);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchImproveScoreData();
  }, [user]);

  if (loading || !data) {
    return (
      <div className="improve-score-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your improvement plan...</p>
        </div>
      </div>
    );
  }

  const scoreGap = data.targetScore - data.currentScore;
  const progressPercent = (data.currentScore / data.targetScore) * 100;

  return (
    <div className="improve-score-page">

      <div className="improve-container">
        {/* Header Section */}
        <div className="improve-header">
          <h1>🚀 Improve Your Credit Score</h1>
          <p className="subtitle">AI-powered personalized roadmap to reach your financial goals</p>
        </div>

        {/* Score Progress Section */}
        <div className="score-progress-section">
          <div className="progress-card">
            <div className="progress-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2>Your Credit Journey</h2>
                  <p className="progress-description">Track your progress toward your credit score goal</p>
                </div>
                <button
                  className="info-btn"
                  onClick={() => setActiveModal('journey')}
                  title="How does score tracking work?"
                >
                  ℹ️
                </button>
              </div>
              <div className="score-range">
                <span className="current-score">Current: {data.currentScore}</span>
                <span className="target-score">Target: {data.targetScore}</span>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="progress-labels">
                <span>0</span>
                <span>450</span>
                <span>600</span>
                <span>750</span>
                <span>900</span>
              </div>
            </div>
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-label">Gap to Target</span>
                <span className="stat-value">{scoreGap} points</span>
              </div>
              <div className="stat">
                <span className="stat-label">Estimated Timeline</span>
                <span className="stat-value">6-12 months</span>
              </div>
              <div className="stat">
                <span className="stat-label">Completion</span>
                <span className="stat-value">{Math.round(progressPercent)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Loan Display */}
        {selectedLoan && (
          <div className="selected-loan-section">
            <div className="selected-loan-card">
              <div className="loan-close-btn" onClick={() => window.history.back()}>✕</div>
              <h3>📋 Your Selected Loan Application</h3>
              <div className="loan-details-grid">
                <div className="loan-detail-item">
                  <span className="detail-label">Loan Type</span>
                  <span className="detail-value">{selectedLoan.type}</span>
                </div>
                <div className="loan-detail-item">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value">₹{selectedLoan.amount?.toLocaleString()}</span>
                </div>
                <div className="loan-detail-item">
                  <span className="detail-label">Interest Rate</span>
                  <span className="detail-value">{selectedLoan.interestRate}% p.a.</span>
                </div>
                <div className="loan-detail-item">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">{selectedLoan.tenure} months</span>
                </div>
              </div>
              <button className="apply-loan-btn" onClick={() => alert('🎉 Application submitted successfully!\\n\\nWe will review and contact you within 24-48 hours.')}>
                ✓ Submit Application
              </button>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="recommendations-section">
          <div className="section-header">
            <div className="header-content">
              <h2>🤖 AI-Powered Recommendations</h2>
              <p>Personalized actions ranked by impact and priority</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal('recommendations')}
              title="How are these recommendations generated?"
            >
              ℹ️
            </button>
          </div>

          <div className="recommendations-list">
            {data.recommendations?.map((rec, index) => (
              <div
                key={rec.id}
                className={`recommendation-item priority-${rec.priority.toLowerCase()}`}
                onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
              >
                <div className="rec-main">
                  <div className="rec-icon">{rec.icon}</div>
                  <div className="rec-content">
                    <div className="rec-title-row">
                      <h3>{rec.title}</h3>
                      <span className={`priority-badge ${rec.priority.toLowerCase()}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="rec-description">{rec.description}</p>
                    <div className="rec-meta">
                      <span className="meta-item">
                        <strong>Impact:</strong> {rec.estimatedImpact}
                      </span>
                      <span className="meta-item">
                        <strong>Timeframe:</strong> {rec.timeframe}
                      </span>
                      <span className="meta-item">
                        <strong>Difficulty:</strong> {rec.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="rec-arrow">
                    {expandedRec === rec.id ? '▼' : '▶'}
                  </div>
                </div>

                {expandedRec === rec.id && (
                  <div className="rec-expanded">
                    <div className="reasoning">
                      <h4>💭 AI Reasoning</h4>
                      <p>{rec.aiReasoning}</p>
                    </div>
                    {rec.actionItems && (
                      <div className="action-items">
                        <h4>✅ Action Items</h4>
                        <ul>
                          {rec.actionItems.map((item, idx) => (
                            <li key={idx}>
                              <input type="checkbox" id={`action-${rec.id}-${idx}`} />
                              <label htmlFor={`action-${rec.id}-${idx}`}>{item}</label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Score Factors */}
        <div className="key-factors-section">
          <div className="section-header">
            <div className="header-content">
              <h2>📊 Credit Score Factors (Impact Weighted)</h2>
              <p>Understanding what affects your credit score</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal('factors')}
              title="Understand these factors"
            >
              ℹ️
            </button>
          </div>
          <div className="factors-info">
            <div className="factor-info">
              <div className="factor-circle" style={{ backgroundColor: '#27ae60' }}>
                <span>35%</span>
              </div>
              <h4>Payment History</h4>
              <p>On-time payment record is the most critical factor</p>
            </div>
            <div className="factor-info">
              <div className="factor-circle" style={{ backgroundColor: '#3498db' }}>
                <span>30%</span>
              </div>
              <h4>Credit Utilization</h4>
              <p>Keep usage below 30% of your available limits</p>
            </div>
            <div className="factor-info">
              <div className="factor-circle" style={{ backgroundColor: '#f39c12' }}>
                <span>15%</span>
              </div>
              <h4>Credit History Length</h4>
              <p>Longer history shows stability and experience</p>
            </div>
            <div className="factor-info">
              <div className="factor-circle" style={{ backgroundColor: '#e74c3c' }}>
                <span>10%</span>
              </div>
              <h4>Credit Mix</h4>
              <p>Diverse credit types show management ability</p>
            </div>
            <div className="factor-info">
              <div className="factor-circle" style={{ backgroundColor: '#9b59b6' }}>
                <span>10%</span>
              </div>
              <h4>New Inquiries</h4>
              <p>Multiple inquiries may indicate financial stress</p>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        {data.successStories && data.successStories.length > 0 && (
          <div className="success-stories-section">
            <div className="section-header">
              <div className="header-content">
                <h2>🏆 Success Stories</h2>
                <p>Real users who improved their credit scores</p>
              </div>
              <button
                className="info-btn"
                onClick={() => setActiveModal('stories')}
                title="Learn from success stories"
              >
                ℹ️
              </button>
            </div>
            <div className="stories-grid">
              {data.successStories.map((story, index) => (
                <div key={index} className="story-card">
                  <div className="story-header">
                    <h3>{story.name}</h3>
                  </div>
                  <div className="story-scores">
                    <div className="score-item">
                      <span className="label">From</span>
                      <span className="score" style={{ color: '#e74c3c' }}>{story.initialScore}</span>
                    </div>
                    <div className="score-arrow">→</div>
                    <div className="score-item">
                      <span className="label">To</span>
                      <span className="score" style={{ color: '#27ae60' }}>{story.currentScore}</span>
                    </div>
                  </div>
                  <div className="improvement">
                    +{story.currentScore - story.initialScore} points in {story.timeframe}
                  </div>
                  <p className="story-text">{story.story}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Section */}
        <div className="resources-section">
          <div className="section-header">
            <div className="header-content">
              <h2>📚 Educational Resources</h2>
              <p>Learn about credit management and financial growth</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal('resources')}
              title="Why education matters"
            >
              ℹ️
            </button>
          </div>
          <div className="resources-grid">
            <div className="resource-card">
              <h4>Understanding Credit Scores</h4>
              <p>Learn how credit scores are calculated and what factors matter most.</p>
              <button className="btn-secondary">Learn More</button>
            </div>
            <div className="resource-card">
              <h4>Debt Management Strategies</h4>
              <p>Discover effective techniques to manage and reduce your debt.</p>
              <button className="btn-secondary">Learn More</button>
            </div>
            <div className="resource-card">
              <h4>Credit Report Guide</h4>
              <p>How to read and dispute errors in your credit report.</p>
              <button className="btn-secondary">Learn More</button>
            </div>
            <div className="resource-card">
              <h4>Financial Planning</h4>
              <p>Build a sustainable financial plan for long-term wealth building.</p>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
        </div>

        {/* InfoModals */}
        {activeModal === 'journey' && (
          <InfoModal
            title="Understanding Your Credit Journey"
            icon="🚀"
            description="Your credit journey shows your progress toward a healthier credit score. The gap between your current and target score represents the improvement needed."
            features={[
              "Current Score: Your actual credit score right now",
              "Target Score: Your goal credit score (typically 750+)",
              "Progress Tracking: Visual representation of your advancement",
              "Timeline Estimate: Typical timeframe to reach your goal (6-12 months)",
              "Completion Percentage: How far you've progressed on your journey"
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'recommendations' && (
          <InfoModal
            title="How AI Recommendations Work"
            icon="🤖"
            description="Our AI analyzes your credit profile and generates personalized recommendations sorted by impact and urgency. Each recommendation shows potential score improvement and required effort."
            features={[
              "Impact Analysis: Predicts how much your score could improve",
              "Priority Ranking: Critical actions are listed first",
              "Timeframe: Realistic timeline for implementation",
              "Difficulty Level: Easy, Medium, or Hard - based on effort required",
              "Action Items: Step-by-step guidance for each recommendation",
              "AI Reasoning: Explanation of why this recommendation matters for you"
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'factors' && (
          <InfoModal
            title="Credit Score Factors Explained"
            icon="📊"
            description="Your credit score is calculated based on five key factors. Understanding their weight helps you prioritize improvement efforts."
            features={[
              "Payment History (35%): Most important - always pay on time",
              "Credit Utilization (30%): Keep balances below 30% of limits",
              "Credit History Length (15%): Older accounts build trust",
              "Credit Mix (10%): Different types of credit (cards, loans, etc.)",
              "New Inquiries (10%): Multiple recent inquiries may hurt score",
              "Focus on payment history and utilization for fastest improvement"
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'stories' && (
          <InfoModal
            title="Learning from Success Stories"
            icon="🏆"
            description="Real users have improved their credit scores by following AI recommendations. These stories show what's possible and inspire your own journey."
            features={[
              "Realistic Improvements: See typical score increases (50-200 points)",
              "Timeline Examples: Most see improvements in 6-12 months",
              "Strategy Insights: Understand what worked for others",
              "Similar Situations: Find stories matching your credit profile",
              "Motivation: Proof that improvement is achievable",
              "Your Path Forward: Use these examples to plan your strategy"
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'resources' && (
          <InfoModal
            title="Educational Resources Guide"
            icon="📚"
            description="Financial education is key to long-term credit health. Our resources help you understand credit concepts and make informed decisions."
            features={[
              "Credit Score Basics: Learn how scores are calculated",
              "Debt Management: Strategies to reduce and manage debt effectively",
              "Report Reading: Understand your credit report and dispute errors",
              "Financial Planning: Build wealth and financial security",
              "Best Practices: Tips from financial experts and professionals",
              "Continuous Learning: Stay updated on credit and finance trends"
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    </div>
  );
}

