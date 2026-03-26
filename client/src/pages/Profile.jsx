import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import InfoModal from "../components/InfoModal";
import "../styles/profile.css";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeModal, setActiveModal] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMemberSince = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    return parts.length ? parts.join(" ") : "Less than a month";
  };

  const normalizeProfile = (raw = {}) => ({
    name: raw.name || "Unknown User",
    email: raw.email || "Not available",
    phone: raw.phone || "Not available",
    accountCreated: raw.createdAt ? formatDate(raw.createdAt) : "N/A",
    memberSince: raw.createdAt ? getMemberSince(raw.createdAt) : "N/A",
    creditScore: raw.creditScore ?? 650,
    accountStatus: raw.isActive ? "Active" : "Inactive",
    verificationStatus: raw.isDemo
      ? "Demo user"
      : raw.isVerified
        ? "Verified"
        : "Unverified",
    profileCompletion: raw.profileCompletionPercentage ?? 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const initialData = normalizeProfile(user);
    setUserProfile(initialData);

    axiosInstance
      .get("/users/profile")
      .then((res) => {
        if (res.data && res.data.success && res.data.user) {
          setUserProfile(normalizeProfile(res.data.user));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const personalInfo = userProfile
    ? [
        { label: "Email Address", value: userProfile.email, editable: false },
        { label: "Phone Number", value: userProfile.phone, editable: true },
        {
          label: "Account Created",
          value: userProfile.accountCreated,
          editable: false,
        },
        {
          label: "Member Since",
          value: userProfile.memberSince,
          editable: false,
        },
        {
          label: "Profile Completion",
          value: `${userProfile.profileCompletion}%`,
          editable: false,
        },
        {
          label: "Credit Score",
          value: `${userProfile.creditScore}`,
          editable: false,
        },
      ]
    : [];

  const accountSettings = [
    {
      icon: "🔒",
      title: "Privacy Settings",
      description: "Control who can see your information",
      status: "Standard",
      action: "Manage",
    },
    {
      icon: "🔐",
      title: "Security Preferences",
      description: "Manage two-factor authentication and security options",
      status: "Enabled",
      action: "Configure",
    },
    {
      icon: "📧",
      title: "Email Notifications",
      description: "Choose what email alerts you receive",
      status: "All Enabled",
      action: "Customize",
    },
    {
      icon: "🔔",
      title: "Push Notifications",
      description: "Control in-app and mobile notifications",
      status: "Enabled",
      action: "Adjust",
    },
  ];

  if (loading || !userProfile) {
    return (
      <div className="profile-page">
        <div className="profile-container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#fff" }}>Loading your profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Section
        <div className="profile-header">
          <h1>👤 Your Profile</h1>
          <p className="subtitle">
            Manage your personal information and preferences
          </p>
          <div className="profile-actions">
            <button
              className="profile-btn btn-primary"
              onClick={() => alert("✏️ Profile editing features coming soon!")}
            >
              ✏️ Edit Profile
            </button>
            <button
              className="profile-btn btn-secondary"
              onClick={() => navigate("/credit-report")}
            >
              📋 View Report
            </button>
            <button
              className="profile-btn btn-secondary"
              onClick={() => alert("📞 Support team will contact you shortly!")}
            >
              🆘 Contact Support
            </button>
          </div>
        </div> */}

        {/* Profile Summary Card */}
        <div className="profile-summary-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <span>
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="profile-details">
              <h2>{userProfile.name}</h2>
              <p className="verification-badge">
                ✓ {userProfile.verificationStatus}
              </p>
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat-box">
              <span className="stat-label">Credit Score</span>
              <span className="stat-value">{userProfile.creditScore}</span>
            </div>
            {/* <div className="stat-box">
              <span className="stat-label">Account Status</span>
              <span className="stat-value active">
                {userProfile.accountStatus}
              </span>
            </div> */}
            <div className="stat-box">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">{userProfile.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <div className="header-content">
              <h3>📋 Personal Information</h3>
              <p>Your basic account information</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal("personal")}
              title="Why we need this information"
            >
              ℹ️
            </button>
          </div>

          <div className="info-list">
            {personalInfo.map((item, index) => (
              <div key={index} className="info-row">
                <span className="info-label">{item.label}</span>
                <div className="info-value-container">
                  <span className="info-value">{item.value}</span>
                  {item.editable && (
                    <span className="editable-tag">Editable</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Health Section */}
        <div className="profile-section">
          <div className="section-header">
            <div className="header-content">
              <h3>❤️ Account Health</h3>
              <p>Your account security and status</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal("health")}
              title="What affects your account health"
            >
              ℹ️
            </button>
          </div>

          <div className="health-status-grid">
            <div className="health-item healthy">
              <span className="health-icon">✓</span>
              <h4>Verification Status</h4>
              <p>Your account is fully verified</p>
            </div>
            <div className="health-item secure">
              <span className="health-icon">🔒</span>
              <h4>Security Level</h4>
              <p>High - 2FA Enabled</p>
            </div>
            <div className="health-item clean">
              <span className="health-icon">📊</span>
              <h4>Profile Completion</h4>
              <p>100% Complete</p>
            </div>
            <div className="health-item active">
              <span className="health-icon">✨</span>
              <h4>Activity Status</h4>
              <p>Active - Last login today</p>
            </div>
          </div>
        </div>

        {/* Settings & Preferences Section */}
        <div className="profile-section">
          <div className="section-header">
            <div className="header-content">
              <h3>⚙️ Settings & Preferences</h3>
              <p>Customize your account experience</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal("settings")}
              title="How to customize settings"
            >
              ℹ️
            </button>
          </div>

          <div className="settings-grid">
            {accountSettings.map((setting, index) => (
              <div key={index} className="setting-card">
                <div className="setting-header">
                  <span className="setting-icon">{setting.icon}</span>
                  <div className="setting-info">
                    <h4>{setting.title}</h4>
                    <p>{setting.description}</p>
                  </div>
                </div>
                <div className="setting-footer">
                  <span
                    className={`status-badge ${setting.status.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {setting.status}
                  </span>
                  <button className="btn-manage">{setting.action}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Section */}
        <div className="profile-section">
          <div className="section-header">
            <div className="header-content">
              <h3>📦 Subscription Plan</h3>
              <p>Manage your subscription and premium features</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal("subscription")}
              title="Upgrade your plan"
            >
              ℹ️
            </button>
          </div>

          <div className="subscription-info">
            <div className="plan-card current-plan">
              <div className="plan-badge">Current Plan</div>
              <h4>Premium Plus</h4>
              <p className="plan-price">$9.99/month</p>
              <div className="plan-features">
                <div className="feature">✓ Unlimited credit monitoring</div>
                <div className="feature">✓ Real-time alerts</div>
                <div className="feature">✓ AI-powered recommendations</div>
                <div className="feature">✓ Priority support</div>
                <div className="feature">✓ Score tracking history</div>
              </div>
              <p className="renewal-date">Next renewal: February 15, 2024</p>
              <button className="btn-secondary">Manage Subscription</button>
            </div>

            <div className="billing-history">
              <h4>Recent Billing</h4>
              <div className="billing-items">
                <div className="billing-item">
                  <span className="billing-date">Feb 15, 2024</span>
                  <span className="billing-desc">
                    Premium Plus Subscription
                  </span>
                  <span className="billing-amount">$9.99</span>
                </div>
                <div className="billing-item">
                  <span className="billing-date">Jan 15, 2024</span>
                  <span className="billing-desc">
                    Premium Plus Subscription
                  </span>
                  <span className="billing-amount">$9.99</span>
                </div>
                <div className="billing-item">
                  <span className="billing-date">Dec 15, 2023</span>
                  <span className="billing-desc">
                    Premium Plus Subscription
                  </span>
                  <span className="billing-amount">$9.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Resources Section */}
        <div className="profile-section">
          <div className="section-header">
            <div className="header-content">
              <h3>💬 Support & Resources</h3>
              <p>Get help when you need it</p>
            </div>
            <button
              className="info-btn"
              onClick={() => setActiveModal("support")}
              title="How to get support"
            >
              ℹ️
            </button>
          </div>

          <div className="support-grid">
            <div className="support-card">
              <span className="support-icon">📞</span>
              <h4>Contact Support</h4>
              <p>Get help from our support team</p>
              <button className="btn-secondary">Chat Now</button>
            </div>
            <div className="support-card">
              <span className="support-icon">📖</span>
              <h4>Knowledge Base</h4>
              <p>Browse articles and tutorials</p>
              <button className="btn-secondary">Browse</button>
            </div>
            <div className="support-card">
              <span className="support-icon">🐛</span>
              <h4>Report Issue</h4>
              <p>Report bugs or technical issues</p>
              <button className="btn-secondary">Report</button>
            </div>
            <div className="support-card">
              <span className="support-icon">💡</span>
              <h4>Feedback</h4>
              <p>Share your ideas and suggestions</p>
              <button className="btn-secondary">Suggest</button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="profile-section danger-zone">
          <div className="section-header">
            <div className="header-content">
              <h3>⚠️ Account Management</h3>
              <p>Advanced account options</p>
            </div>
          </div>

          <div className="danger-actions">
            <div className="action-item">
              <div>
                <h4>Change Password</h4>
                <p>Update your account password</p>
              </div>
              <button className="btn-secondary">Change</button>
            </div>
            <div className="action-item">
              <div>
                <h4>Export Data</h4>
                <p>Download your account data</p>
              </div>
              <button className="btn-secondary">Export</button>
            </div>
            <div className="action-item">
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your account</p>
              </div>
              <button className="btn-danger">Delete</button>
            </div>
          </div>
        </div>

        {/* InfoModals */}
        {activeModal === "personal" && (
          <InfoModal
            title="Personal Information"
            icon="📋"
            description="We collect your personal information to maintain your account securely and provide you with better service. This information is never shared with third parties without your consent."
            features={[
              "Email Address: Used for account login and notifications",
              "Phone Number: For security verification and optional SMS alerts",
              "Account Creation Date: Shows when you joined our platform",
              "Membership Duration: Reflects your loyalty and account age",
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === "health" && (
          <InfoModal
            title="Account Health Status"
            icon="❤️"
            description="Your account health reflects the security, compliance, and activity status of your account. A healthy account ensures better protection and features."
            features={[
              "Verification Status: Whether your identity is confirmed",
              "Security Level: Multi-factor authentication and security settings",
              "Profile Completion: Percentage of profile information filled in",
              "Activity Status: Your engagement with the platform",
              "No suspicious activity: Your account is safe and secure",
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === "settings" && (
          <InfoModal
            title="Settings & Preferences"
            icon="⚙️"
            description="Customize how you experience FinBridge. Control privacy, security, and communication preferences to suit your needs."
            features={[
              "Privacy Settings: Who can access your information",
              "Security Preferences: 2FA, authentication methods, security questions",
              "Email Notifications: Choose which alerts you want to receive",
              "Push Notifications: In-app and mobile notification settings",
              "Data Visibility: Control what appears on your dashboard",
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === "subscription" && (
          <InfoModal
            title="Subscription Plans"
            icon="📦"
            description="Choose a plan that fits your needs. All plans include unlimited credit monitoring and AI-powered insights."
            features={[
              "Premium Plus: Includes all features with priority support",
              "Real-time Alerts: Get notified immediately of credit changes",
              "Score Tracking: View 12+ months of credit score history",
              "AI Recommendations: Personalized improvement strategies",
              "Flexible Billing: Cancel anytime, no long-term contracts",
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === "support" && (
          <InfoModal
            title="Support & Resources"
            icon="💬"
            description="We're here to help. Choose your preferred way to get support and access resources about credit management."
            features={[
              "24/7 Customer Support: Chat with our team anytime",
              "Knowledge Base: Comprehensive articles and guides",
              "Video Tutorials: Step-by-step guides for all features",
              "FAQ Section: Quick answers to common questions",
              "Email Support: Detailed responses to complex issues",
            ]}
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    </div>
  );
}
