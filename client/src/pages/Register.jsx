import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import '../styles/login.css'; // Reuse login styles

export default function Register() {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await axios.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (registerResponse.data.success) {
        // Auto-login after successful registration
        try {
          await contextLogin(formData.email, formData.password);
          // Redirect to complete profile page for new users
          navigate('/complete-profile');
        } catch (loginErr) {
          // If auto-login fails, redirect to login page
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please log in with your credentials.' 
            }
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
          <p className="tagline">Create Your Account</p>
        </div>

        {/* Register Form Container */}
        <div className="login-form-wrapper">
          {/* Register Form */}
          <form onSubmit={handleRegister} className="login-form">
            <h2 className="form-title">Join FinBridge</h2>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength="6"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? '🔄 Creating Account...' : '📝 Create Account'}
            </button>

            {/* Already have account link */}
            <div className="forgot-password">
              <span>Already have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                Login here
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
