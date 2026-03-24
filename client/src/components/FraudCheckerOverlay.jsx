import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js';

export default function FraudCheckerOverlay({ isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Safe':
        return '#2ecc71';
      case 'Suspicious':
        return '#f1c40f';
      case 'Fraud':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const handleCheck = async () => {
    setError('');
    setResult(null);

    if (!message.trim()) {
      setError('Please enter email or SMS content.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/fraud/check-message', { message });
      setResult(response.data);
    } catch (err) {
      console.error('Fraud check error', err);
      setError(
        err.response?.data?.error || 'Unable to get fraud check result. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fraud-overlay">
      <div className="fraud-modal">
        <div className="fraud-modal-header">
          <h3>Fraud Checker</h3>
          <button className="fraud-close-btn" onClick={onClose} aria-label="Close Fraud Checker">
            ✕
          </button>
        </div>
        <p className="fraud-modal-description">
          Analyze messages for fraud indicators instantly—without leaving this page.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="Paste email or SMS message here..."
          className="fraud-textarea"
        />

        <button
          className="btn fraud-submit-btn"
          onClick={handleCheck}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze for Fraud'}
        </button>

        {error && <div className="fraud-error">{error}</div>}

        {result && (
          <div className="fraud-result">
            <div className="fraud-result-row">
              <span>Risk Score:</span> <strong>{result.riskScore}</strong>
            </div>
            <div className="fraud-result-row">
              <span>Status:</span>{' '}
              <strong style={{ color: getStatusColor(result.status) }}>{result.status}</strong>
            </div>
            <div className="fraud-result-row">
              <span>Reasons:</span>
              <ul>
                {result.reasons?.length ? (
                  result.reasons.map((reason, index) => <li key={index}>{reason}</li>)
                ) : (
                  <li>No specific reasons provided.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
