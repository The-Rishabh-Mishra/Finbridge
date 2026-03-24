import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import '../styles/index.css';

export default function FraudChecker({ isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

  return (
      <div className="fraud-checker-overlay">
        <div className="fraud-checker-card">
          <button
            className="fraud-checker-close"
            onClick={onClose}
            aria-label="Close fraud checker"
          >
            ✕
          </button>
          <h2 style={{ marginBottom: 14, color: '#34495e' }}>Fraud Detection</h2>
        <p style={{ marginBottom: 18, color: '#6b7280' }}>
          Paste email or SMS content below to analyze for possible phishing/fraud indicators.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          placeholder="Paste message content here..."
          style={{ width: '100%', borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, resize: 'vertical' }}
        />

        <button
          onClick={handleCheck}
          style={{
            width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8,
            padding: '12px 16px', fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Check Fraud'}
        </button>

        {loading && (
          <div style={{ marginTop: 16, color: '#34495e' }}>Analyzing message, please wait...</div>
        )}

        {error && (
          <div style={{ marginTop: 16, color: '#e74c3c', fontWeight: 600 }}>{error}</div>
        )}

        {result && (
          <div style={{ marginTop: 20, borderTop: '1px solid #e0e0e0', paddingTop: 18 }}>
            <h3 style={{ marginBottom: 10 }}>Result</h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Risk Score:</strong> {result.riskScore}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Status:</strong>{' '}
              <span style={{ color: getStatusColor(result.status), fontWeight: 700 }}>{result.status}</span>
            </div>
            <div>
              <strong>Reasons:</strong>
              <ul style={{ marginTop: 8, marginLeft: 20 }}>
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
