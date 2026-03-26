import React, { useState } from "react";

const CreditScoreModal = ({ isOpen, onClose, onCalculate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    monthlyIncome: "",
    hasExistingLoans: "no",
    loanAmount: "",
    creditCardUsage: "",
    paymentHistory: "on-time",
    activeAccounts: "",
    recentInquiries: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.age || formData.age < 18 || formData.age > 100)
      newErrors.age = "Age must be between 18 and 100";
    if (!formData.monthlyIncome || formData.monthlyIncome < 0)
      newErrors.monthlyIncome = "Monthly income must be a positive number";
    if (
      !formData.creditCardUsage ||
      formData.creditCardUsage < 0 ||
      formData.creditCardUsage > 100
    )
      newErrors.creditCardUsage = "Credit card usage must be between 0 and 100";
    if (!formData.activeAccounts || formData.activeAccounts < 0)
      newErrors.activeAccounts =
        "Number of active accounts must be non-negative";
    if (!formData.recentInquiries || formData.recentInquiries < 0)
      newErrors.recentInquiries = "Recent inquiries must be non-negative";

    if (
      formData.hasExistingLoans === "yes" &&
      (!formData.loanAmount || formData.loanAmount < 0)
    ) {
      newErrors.loanAmount = "Loan amount is required and must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate calculation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onCalculate(formData);
      onClose();
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Calculate Your Credit Score</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "error" : ""}
              />
              {errors.fullName && (
                <span className="error-text">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                className={errors.age ? "error" : ""}
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="monthlyIncome">Monthly Income (₹) *</label>
              <input
                type="number"
                id="monthlyIncome"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                min="0"
                className={errors.monthlyIncome ? "error" : ""}
              />
              {errors.monthlyIncome && (
                <span className="error-text">{errors.monthlyIncome}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="hasExistingLoans">Existing Loans *</label>
              <select
                id="hasExistingLoans"
                name="hasExistingLoans"
                value={formData.hasExistingLoans}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {formData.hasExistingLoans === "yes" && (
              <div className="form-group">
                <label htmlFor="loanAmount">Total Loan Amount (₹) *</label>
                <input
                  type="number"
                  id="loanAmount"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  min="0"
                  className={errors.loanAmount ? "error" : ""}
                />
                {errors.loanAmount && (
                  <span className="error-text">{errors.loanAmount}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="creditCardUsage">Credit Card Usage (%) *</label>
              <input
                type="number"
                id="creditCardUsage"
                name="creditCardUsage"
                value={formData.creditCardUsage}
                onChange={handleChange}
                min="0"
                max="100"
                className={errors.creditCardUsage ? "error" : ""}
              />
              {errors.creditCardUsage && (
                <span className="error-text">{errors.creditCardUsage}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="paymentHistory">Payment History *</label>
              <select
                id="paymentHistory"
                name="paymentHistory"
                value={formData.paymentHistory}
                onChange={handleChange}
              >
                <option value="on-time">Mostly On-time</option>
                <option value="late">Some Late Payments</option>
                <option value="very-late">Frequent Late Payments</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="activeAccounts">
                Number of Active Accounts *
              </label>
              <input
                type="number"
                id="activeAccounts"
                name="activeAccounts"
                value={formData.activeAccounts}
                onChange={handleChange}
                min="0"
                className={errors.activeAccounts ? "error" : ""}
              />
              {errors.activeAccounts && (
                <span className="error-text">{errors.activeAccounts}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="recentInquiries">Recent Credit Inquiries *</label>
              <input
                type="number"
                id="recentInquiries"
                name="recentInquiries"
                value={formData.recentInquiries}
                onChange={handleChange}
                min="0"
                className={errors.recentInquiries ? "error" : ""}
              />
              {errors.recentInquiries && (
                <span className="error-text">{errors.recentInquiries}</span>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Calculating..." : "Calculate Score"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditScoreModal;
