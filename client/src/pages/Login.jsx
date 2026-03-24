import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials
  const DEMO_USERS = {
    user: { email: 'john.doe@example.com', password: 'password123' },
    admin: { email: 'admin@FinBridge.com', password: 'admin123' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // If login succeeds, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type) => {
    const demoUser = DEMO_USERS[type];
    setLoginType(type);
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');

    try {
      await login(demoUser.email, demoUser.password);
      // Navigate based on user type
      if (type === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
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
          <p className="tagline">Your AI-Powered Credit Management Platform</p>
        </div>

        {/* Login Form Container */}
        <div className="login-form-wrapper">
          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`tab-button ${loginType === 'user' ? 'active' : ''}`}
              onClick={() => {
                setLoginType('user');
                setError('');
              }}
            >
              👤 User Login
            </button>
            <button
              className={`tab-button ${loginType === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setLoginType('admin');
                setError('');
              }}
            >
              🔐 Admin Login
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            <h2 className="form-title">
              {loginType === 'admin' ? 'Admin Login' : 'Welcome Back'}
            </h2>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
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

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
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

            {/* Remember Me Checkbox */}
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="remember"
                className="form-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="remember" className="checkbox-label">
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? '🔄 Logging in...' : '🔓 Login'}
            </button>

            {/* Forgot Password Link */}
            <div className="forgot-password">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
                Forgot your password?
              </a>
            </div>

            {/* Register Link */}
            <div className="register-link">
              <span>Don't have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
                Register here
              </a>
            </div>
          </form>

          {/* Demo Credentials Section */}
          <div className="demo-section">
            <p className="demo-title">📝 Demo Credentials</p>
            <div className="demo-credentials">
              <div className={`credential-box ${loginType === 'user' ? 'active' : ''}`}>
                <p className="credential-label">User Demo</p>
                <p className="credential-text">Email: john.doe@example.com</p>
                <p className="credential-text">Password: password123</p>
                <button
                  type="button"
                  className="demo-button"
                  onClick={() => handleDemoLogin('user')}
                >
                  Use Demo User
                </button>
              </div>

              <div className={`credential-box ${loginType === 'admin' ? 'active' : ''}`}>
                <p className="credential-label">Admin Demo</p>
                <p className="credential-text">Email: admin@FinBridge.com</p>
                <p className="credential-text">Password: admin123</p>
                <button
                  type="button"
                  className="demo-button"
                  onClick={() => handleDemoLogin('admin')}
                >
                  Use Demo Admin
                </button>
              </div>
            </div>
          </div>
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

