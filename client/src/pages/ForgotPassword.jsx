import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import '../styles/login.css'; // Reuse login styles

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/forgot-password', { email });

      if (response.data.success) {
        setMessage('If an account with that email exists, a password reset link has been sent.');
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo Section */}
        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <span className="logo-icon">💳</span>
            </div>
            <h1 className="app-title">FinBridge</h1>
          </div>
          <p className="tagline">Reset Your Password</p>
        </div>

        {/* Forgot Password Form Container */}
        <div className="login-form-wrapper">
          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="form-title">Forgot Password</h2>

            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '12px',
                borderRadius: '5px',
                marginBottom: '20px',
                border: '1px solid #c3e6cb'
              }}>
                <span>✅</span>
                <span style={{ marginLeft: '8px' }}>{message}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? '🔄 Sending...' : '📧 Send Reset Link'}
            </button>

            {/* Back to Login Link */}
            <div className="register-link">
              <span>Remember your password? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                Back to Login
              </a>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h3>Secure</h3>
            <p>Enterprise-grade security</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <h3>AI-Powered</h3>
            <p>Smart credit insights</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <h3>Fast</h3>
            <p>Real-time updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
