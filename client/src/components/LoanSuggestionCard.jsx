import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoanSuggestionCard({ loan }) {
  const navigate = useNavigate();
  
  const handleApplyNow = () => {
    navigate('/improve-score', { state: { selectedLoan: loan } });
  };

  const calculateEMI = (principal, rate, months) => {
    const monthlyRate = rate / 12 / 100;
    if (monthlyRate === 0) return Math.round(principal / months);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI(loan?.amount, loan?.interestRate, loan?.tenure);
  const totalPayable = monthlyEMI * loan?.tenure;
  const totalInterest = totalPayable - loan?.amount;

  return (
    <div className="loan-suggestion-card" style={{ borderTopColor: loan?.color }}>
      <div className="loan-header">
        <div className="loan-title-section">
          <h3>{loan?.type}</h3>
          <span className="loan-badge" style={{ backgroundColor: loan?.color }}>
            {loan?.recommendation}
          </span>
        </div>
        <div className="eligibility-score">
          <span className="score-label">Eligibility</span>
          <span className="score-value" style={{ color: loan?.color }}>
            {loan?.eligibilityScore}%
          </span>
        </div>
      </div>

      <div className="loan-details">
        <div className="detail-row">
          <span className="label">Loan Amount</span>
          <span className="value">₹{loan?.amount?.toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="label">Interest Rate</span>
          <span className="value">{loan?.interestRate}% p.a.</span>
        </div>
        <div className="detail-row">
          <span className="label">Tenure</span>
          <span className="value">{loan?.tenure} months ({Math.round(loan?.tenure / 12)} years)</span>
        </div>
      </div>

      <div className="loan-calculations">
        <div className="calc-item">
          <span className="calc-label">Monthly EMI</span>
          <span className="calc-value">₹{monthlyEMI.toLocaleString()}</span>
        </div>
        <div className="calc-item">
          <span className="calc-label">Total Interest</span>
          <span className="calc-value">₹{totalInterest.toLocaleString()}</span>
        </div>
        <div className="calc-item">
          <span className="calc-label">Total Payable</span>
          <span className="calc-value">₹{totalPayable.toLocaleString()}</span>
        </div>
      </div>

      {loan?.aiNote && (
        <div className="ai-note">
          <span className="ai-icon">🤖</span>
          <p>{loan?.aiNote}</p>
        </div>
      )}

      <button className="apply-btn" style={{ backgroundColor: loan?.color }} onClick={handleApplyNow}>
        Apply Now
      </button>
    </div>
  );
}

