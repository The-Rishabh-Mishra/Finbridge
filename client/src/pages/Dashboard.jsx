import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axiosInstance';
import ScoreCard from '../components/ScoreCard';
import ProfileCard from '../components/ProfileCard';
import LoanSuggestionCard from '../components/LoanSuggestionCard';
import InfoModal from '../components/InfoModal';
import { generateDashboardDataFromCIBIL } from '../utils/scoreCalculationService.js';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleRecalculateScore = async () => {
    if (!user) return;

    // reset the score in dashboard state so the empty-state block shows
    setDashboardData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        creditScore: 0,
        scoreInsight: 'Please recalculate your score.',
        trend: null,
        trendPercentage: 0,
      };
    });

    // optionally send user to CIBIL calculator to fill values again
    navigate('/cibil-calculator');
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        if (user) {
          // Generate dashboard data from user's CIBIL calculations
          const userId = user.id || user.email;
          const dashData = generateDashboardDataFromCIBIL(userId, user);
          setDashboardData(dashData);
        } else {
          // No user - show empty state
          setDashboardData(null);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your financial profile...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData || dashboardData.creditScore === 0) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No CIBIL Score Yet</h2>
            <p>Calculate your CIBIL score to see your credit profile dashboard and get personalized recommendations.</p>
            <button className="action-btn btn-primary" onClick={() => navigate('/cibil-calculator')}>
              📊 Calculate CIBIL Score Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1>Welcome back, {dashboardData?.user?.name}! 👋</h1>
            <p className="hero-subtitle">Your AI-powered credit analysis dashboard</p>
            <div className="hero-info">
              <div className="info-item">
                <span className="info-label">📊 Dashboard Function:</span>
                <p>Real-time view of your credit profile, score trends, and personalized financial recommendations based on AI analysis.</p>
              </div>
              <div className="quick-actions">
                <button className="action-btn btn-primary" onClick={() => navigate('/credit-report')}>
                  📋 View Full Report
                </button>
                <button className="action-btn btn-secondary" onClick={() => navigate('/history')}>
                  📈 View Trends
                </button>
                <button className="action-btn btn-secondary" onClick={() => navigate('/improve-score')}>
                  🚀 Improve Score
                </button>
              </div>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-label">Profile Completeness</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${dashboardData?.user?.profileCompletionPercentage}%` }}></div>
              </div>
              <span className="stat-value">{dashboardData?.user?.profileCompletionPercentage}%</span>
            </div>
            <InfoModal
              title="Dashboard Overview"
              icon="📊"
              description="The Dashboard provides a comprehensive overview of your credit health and financial status."
              features={[
                "Real-time credit score display with trend analysis",
                "AI-powered credit factor breakdown (Payment History, Utilization, etc.)",
                "Personalized recommendations to improve your score",
                "Available loan products matched to your profile",
                "Account health assessment",
                "Recent transaction history"
              ]}
            />
          </div>
        </div>

        {/* Profile Completion Banner */}
        {!user?.profileCompleted && !user?.isDemo && (
          <div className="profile-completion-banner">
            <div className="banner-content">
              <div className="banner-icon">📝</div>
              <div className="banner-text">
                <h3>Complete Your Profile</h3>
                <p>Finish setting up your profile to unlock personalized credit insights and recommendations.</p>
              </div>
              <button
                className="banner-btn"
                onClick={() => navigate('/complete-profile')}
              >
                Complete Now
              </button>
            </div>
          </div>
        )}

        {/* Primary Score Card */}
        <div className="dashboard-grid primary-grid">
          <div className="grid-item score-section">
            <ScoreCard
              score={dashboardData?.creditScore}
              scoreInsight={dashboardData?.scoreInsight}
              previousScore={dashboardData?.previousScore}
              trend={dashboardData?.trend}
              trendPercentage={dashboardData?.trendPercentage}
            />
            <button
              className="action-btn btn-secondary"
              onClick={handleRecalculateScore}
              disabled={loading}
            >
               Calculate Your Score Again
            </button>
          </div>

          <div className="grid-item profile-section">
            <ProfileCard user={dashboardData?.user} />
          </div>
        </div>

        {/* AI Credit Factors */}
        <div className="dashboard-section ai-factors-section">
          <div className="section-header">
            <div className="header-content">
              <h2>🤖 AI Credit Score Breakdown</h2>
              <p className="section-subtitle">Key factors impacting your creditworthiness</p>
            </div>
            <InfoModal
              title="How Credit Factors Work"
              icon="🔍"
              description="Your credit score is calculated using 5 key factors, each with different impact levels. The AI analyzes your behavior in each category to provide personalized insights."
              features={[
                "Payment History (35%): On-time payment record is most critical",
                "Credit Utilization (30%): How much of your credit limits you use",
                "Credit History (15%): Length of your credit accounts",
                "Credit Mix (10%): Variety of credit types (cards, loans, etc.)",
                "New Inquiries (10%): Recent credit applications and hard pulls"
              ]}
            />
          </div>
          <div className="credit-factors-grid">
            {dashboardData?.creditFactors?.map((factor, index) => {
              const statusLabel = (factor.status || 'Unknown').toString();
              const statusClass = statusLabel.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={index} className="factor-card">
                  <div className="factor-header">
                    <h3>{factor.label || 'N/A'}</h3>
                    {/* <span className={`status-badge status-${statusClass}`}>
                      {statusLabel}
                    </span> */}
                  </div>
                  <div className="factor-percentage">
                    <div className="percentage-circle">
                      <span className="percentage-value">{Math.round(factor.score ?? factor.percentage ?? 0)}%</span>
                    </div>
                  </div>
                  <div className="factor-bar">
                    <div
                      className="factor-progress"
                      style={{ width: `${Math.min(factor.score ?? factor.percentage ?? 0, 100)}%` }}
                    />
                  </div>
                  <p className="factor-weight">Weight: {factor.weight ?? 0}%</p>
                  <p className="factor-insight">💡 {factor.insight || 'No data available.'}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        {dashboardData?.aiRecommendations?.length > 0 && (
          <div className="dashboard-section recommendations-section">
            <div className="section-header">
              <div className="header-content">
                <h2>✨ AI-Powered Recommendations</h2>
                <p className="section-subtitle">Personalized actions to improve your credit</p>
              </div>
              <InfoModal
                title="How Recommendations Work"
                icon="✨"
                description="Our AI analyzes your credit profile and generates personalized, actionable recommendations. Each recommendation shows priority level, estimated impact, and specific steps you can take."
                features={[
                  "Prioritized by impact potential on your score",
                  "Estimated score improvement in points",
                  "Specific, actionable steps with timelines",
                  "Realistic difficulty assessment",
                  "AI reasoning for each recommendation"
                ]}
              />
            </div>
            <div className="recommendations-list">
              {dashboardData?.aiRecommendations?.map((rec, index) => {
                const priorityLabel = (rec.priority || 'low').toString();
                const priorityClass = priorityLabel.toLowerCase().replace(/\s+/g, '-');
                return (
                  <div key={index} className={`recommendation-card priority-${priorityClass}`}>
                    <div className="rec-header">
                      <h3>{rec.title || 'Recommendation'}</h3>
                      <span className={`priority-badge priority-${priorityClass}`}>
                        {priorityLabel}
                      </span>
                    </div>
                    <p className="rec-description">{rec.description}</p>
                    <div className="rec-impact">
                      <span className="impact-label">Estimated Impact:</span>
                      <span className="impact-value">{rec.estimatedImpact}</span>
                    </div>
                    <div className="rec-actions">
                      {rec.actions?.map((action, idx) => (
                        <div key={idx} className="action-item">
                          <span className="action-bullet">→</span>
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loan Suggestions */}
        <div className="dashboard-section loans-section">
          <div className="section-header">
            <h2>💼 Loan Suggestions For You</h2>
            <p className="section-subtitle">Personalized loan products based on your credit profile</p>
          </div>
          <div className="loans-grid">
            {dashboardData?.loanSuggestions?.map((loan, index) => (
              <LoanSuggestionCard
                key={loan.id || index}
                loan={loan}
              />
            ))}
          </div>
        </div>

        {/* Account Health */}
        <div className="dashboard-section health-section">
          <div className="section-header">
            <h2>📊 Account Health Score</h2>
          </div>
          <div className="health-container">
            <div className="health-score-card">
              <div className="health-circle">
                <span className="health-score">{dashboardData?.accountHealth?.score}</span>
                <span className="health-label">/ 100</span>
              </div>
              <p className="health-status">Status: <strong>{dashboardData?.accountHealth?.status}</strong></p>
              <p className="health-updated">Last Updated: {new Date(dashboardData?.accountHealth?.lastUpdated).toLocaleDateString()}</p>
            </div>
            <div className="health-assessments">
              {dashboardData?.accountHealth?.assessments?.map((assessment, index) => (
                <div key={index} className="assessment-item">
                  <div className="assessment-info">
                    <span className="assessment-name">{assessment.name}</span>
                    <span className="assessment-score">{assessment.score}/100</span>
                  </div>
                  <div className="assessment-bar">
                    <div className="assessment-fill" style={{ width: `${assessment.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-section transactions-section">
          <div className="section-header">
            <h2>📋 Recent Activity</h2>
          </div>
          <div className="transactions-list">
            {dashboardData?.recentTransactions?.map((transaction, index) => (
              <div key={transaction.id || index} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">{transaction.type || 'Unknown'}</span>
                  <span className="transaction-desc">{transaction.description || '-'}</span>
                </div>
                <div className="transaction-details">
                  <span className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                    {transaction.amount < 0 ? '-' : '+'} ₹{Math.abs(transaction.amount || 0).toLocaleString()}
                  </span>
                  <span className={`transaction-status status-${(transaction.status || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}>
                    {transaction.status || 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

