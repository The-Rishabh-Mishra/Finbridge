import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import InfoModal from '../components/InfoModal';
import { getUserCreditReportData, generateCreditReportData } from '../utils/mockDataService.js';
import '../styles/credit-report.css';

export default function CreditReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);

        if (user) {
          // Get user-specific credit report data
          const userReportData = await getUserCreditReportData(user.id || user.email);
          setReport(userReportData);
        } else {
          // Fallback for anonymous users
          const mockReport = generateCreditReportData();
          setReport(mockReport);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        // Fallback to mock data on error
        const mockReport = generateCreditReportData(user);
        setReport(mockReport);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user]);

  if (loading) {
    return (
      <div className="credit-report-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your credit report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="credit-report-page">
      <div className="report-container">
        {/* Header */}
        <div className="report-header-section">
          <div className="header-content">
            <h1>📋 Your Credit Report</h1>
            <p className="subtitle">Detailed analysis of your credit accounts and history</p>
            <div className="report-actions">
              <button className="report-btn btn-primary" onClick={() => navigate('/improve-score')}>
                📈 Improve Score
              </button>
              <button className="report-btn btn-secondary" onClick={() => alert('📥 Downloading your credit report...\n✅ Download will start shortly!')}>
                ⬇️ Download Report
              </button>
              <button className="report-btn btn-secondary" onClick={() => alert('📧 Sharing report via email...\n✅ Check your inbox')}>
                📤 Share Report
              </button>
            </div>
          </div>
          <InfoModal
            title="What is a Credit Report?"
            icon="📋"
            description="Your credit report is a detailed record of your credit history maintained by credit bureaus. It includes all your credit accounts, payment history, inquiries, and other financial information that lenders use to assess your creditworthiness."
            features={[
              "Complete list of all your credit accounts",
              "Payment history for each account",
              "Outstanding balances and credit limits",
              "Recent credit inquiries and applications",
              "Account status and delinquency information",
              "Dispute history and comments"
            ]}
          />
        </div>

        {/* Report ID and Date */}
        <div className="report-info">
          <div className="info-item">
            <span className="label">Report ID:</span>
            <span className="value">{report?.reportId}</span>
          </div>
          <div className="info-item">
            <span className="label">Generated On:</span>
            <span className="value">{new Date(report?.generatedDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Accounts Summary */}
        <div className="report-card accounts-summary">
          <div className="card-header">
            <h2>Accounts Summary</h2>
            <InfoModal
              title="Understanding Your Accounts"
              icon="🏦"
              description="This section summarizes all the credit accounts you have open or closed. Each account type affects your credit differently."
              features={[
                "Active accounts: Currently open and in use",
                "Closed accounts: Paid off or terminated",
                "Delinquent accounts: Accounts with overdue payments",
                "Account diversity helps your credit score"
              ]}
            />
          </div>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">Total Accounts</span>
              <span className="summary-value">{report?.accountsSummary?.totalAccounts}</span>
            </div>
            <div className="summary-card active">
              <span className="summary-label">Active</span>
              <span className="summary-value">{report?.accountsSummary?.activeAccounts}</span>
            </div>
            <div className="summary-card closed">
              <span className="summary-label">Closed</span>
              <span className="summary-value">{report?.accountsSummary?.closedAccounts}</span>
            </div>
            <div className="summary-card delinquent">
              <span className="summary-label">Delinquent</span>
              <span className="summary-value">{report?.accountsSummary?.delinquentAccounts}</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="report-card account-details">
          <div className="card-header">
            <h2>Account Details</h2>
            <InfoModal
              title="Account Information"
              icon="💳"
              description="Detailed information about each of your credit accounts, including type, balance, and payment status."
              features={[
                "Account Type: Credit card, auto loan, mortgage, etc.",
                "Issuer: The lender providing the account",
                "Account Number: Last 4 digits for security",
                "Status: Current, paid off, or delinquent",
                "Payment Status: Whether payments are current"
              ]}
            />
          </div>
          <div className="accounts-list">
            {report?.accountDetails?.map((account, index) => (
              <div key={index} className={`account-item status-${account.status.toLowerCase()}`}>
                <div className="account-main">
                  <div className="account-info">
                    <h3>{account.type}</h3>
                    <p className="issuer">{account.issuer}</p>
                    <p className="account-number">Account: {account.accountNumber}</p>
                  </div>
                  <div className="account-status">
                    <span className={`status-badge status-${account.status.toLowerCase()}`}>
                      {account.status}
                    </span>
                    <span className={`payment-status ${account.paymentStatus === 'Current' ? 'current' : 'overdue'}`}>
                      {account.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="account-details-grid">
                  {account.creditLimit && (
                    <div className="detail">
                      <span className="detail-label">Credit Limit</span>
                      <span className="detail-value">₹{account.creditLimit.toLocaleString()}</span>
                    </div>
                  )}
                  {account.currentBalance !== undefined && (
                    <div className="detail">
                      <span className="detail-label">Balance</span>
                      <span className="detail-value">₹{account.currentBalance.toLocaleString()}</span>
                    </div>
                  )}
                  {account.loanAmount && (
                    <div className="detail">
                      <span className="detail-label">Loan Amount</span>
                      <span className="detail-value">₹{account.loanAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {account.monthlyPayment && (
                    <div className="detail">
                      <span className="detail-label">Monthly Payment</span>
                      <span className="detail-value">₹{account.monthlyPayment.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="detail">
                    <span className="detail-label">Opened</span>
                    <span className="detail-value">{new Date(account.openDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="report-card inquiries">
          <div className="card-header">
            <h2>Recent Inquiries</h2>
            <InfoModal
              title="Understanding Inquiries"
              icon="🔍"
              description="Inquiries show when lenders have checked your credit. Hard inquiries (when you apply for credit) can lower your score slightly and stay on your report for 2 years."
              features={[
                "Hard Inquiry: When you apply for credit (affects score)",
                "Soft Inquiry: When you check your own credit (no impact)",
                "Multiple inquiries show credit seeking behavior",
                "Too many hard inquiries in short time can hurt score"
              ]}
            />
          </div>
          <div className="inquiries-list">
            {report?.inquiries?.map((inquiry, index) => (
              <div key={index} className={`inquiry-item inquiry-${inquiry.type.split(' ')[0].toLowerCase()}`}>
                <div className="inquiry-info">
                  <span className="inquiry-type">{inquiry.type}</span>
                  <p className="inquiry-lender">{inquiry.lender}</p>
                  <p className="inquiry-purpose">{inquiry.purpose}</p>
                </div>
                <span className="inquiry-date">{new Date(inquiry.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="important-info">
          <h3>⚠️ Important Information</h3>
          <ul>
            <li>Review your credit report regularly for errors</li>
            <li>Dispute any inaccuracies immediately with the credit bureau</li>
            <li>Keep your accounts in good standing to maintain creditworthiness</li>
            <li>Avoid applying for too much credit in a short period</li>
            <li>Maintain old accounts even if you don't use them actively</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

