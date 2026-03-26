import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CibilDataForm from '../components/Cibildataform';
import { computeScore, saveCIBILData, getBand } from '../utils/scoreCalculationService';
import '../styles/cibil-calculator.css';

export default function CibilCalculator() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [scoreResult, setScoreResult] = useState(null);
    const [formData, setFormData] = useState(null);

    const handleCalculate = (data) => {
        // Calculate CIBIL score
        const result = computeScore(data);
        setFormData(data);
        setScoreResult(result);

        // Save to user's profile
        if (user) {
            const userId = user.id || user.email;
            saveCIBILData(userId, data, result);
        }
    };

    const handleReset = () => {
        setScoreResult(null);
        setFormData(null);
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    if (!user) {
        return (
            <div className="cibil-calculator-page">
                <div className="not-authenticated">
                    <p>Please log in to calculate your CIBIL score</p>
                    <button onClick={() => navigate('/login')}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="cibil-calculator-page">
            <div className="calculator-wrapper">
                {/* Form Section */}
                <CibilDataForm onSubmit={handleCalculate} />

                {/* Results Section */}
                {scoreResult && (
                    <div className="results-section">
                        <div className="results-header">
                            <h2>Your CIBIL Score Result</h2>
                            <button className="close-btn" onClick={handleReset}>×</button>
                        </div>

                        {/* Score Display */}
                        <div className="score-display">
                            <div className="score-circle">
                                <div className="score-number">{scoreResult.cibil}</div>
                                <div className="score-max">/900</div>
                            </div>

                            <div className="score-info">
                                <div className={`score-band ${getBand(scoreResult.cibil).label.toLowerCase()}`}>
                                    {getBand(scoreResult.cibil).label}
                                </div>
                                <p className="score-subtext">
                                    {scoreResult.cibil >= 800 && "Excellent credit profile. You qualify for the best rates available."}
                                    {scoreResult.cibil >= 750 && scoreResult.cibil < 800 && "Very good credit. Competitive rates available for you."}
                                    {scoreResult.cibil >= 700 && scoreResult.cibil < 750 && "Good credit score. Standard rates available. Room for improvement."}
                                    {scoreResult.cibil >= 650 && scoreResult.cibil < 700 && "Fair credit score. Limited options available. Focus on improving."}
                                    {scoreResult.cibil < 650 && "Poor credit score. Very limited options. Start improving payment history."}
                                </p>
                            </div>
                        </div>

                        {/* Factor Breakdown */}
                        <div className="factors-breakdown">
                            <h3>Score Breakdown</h3>
                            <div className="factors-list">
                                {scoreResult.factors.map((factor) => (
                                    <div key={factor.key} className="factor-item">
                                        <div className="factor-header">
                                            <span className="factor-label">{factor.label}</span>
                                            <span className="factor-weight">Weight: {factor.weight}%</span>
                                        </div>
                                        <div className="factor-score-bar">
                                            <div
                                                className="factor-score-fill"
                                                style={{
                                                    width: `${factor.score}%`,
                                                    backgroundColor: factor.color
                                                }}
                                            />
                                        </div>
                                        <div className="factor-details">
                                            <p className="detail-text">{factor.detail}</p>
                                            <p className="detail-tip">💡 {factor.tip}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="result-actions">
                            <button className="btn btn-secondary" onClick={handleReset}>
                                ← Recalculate
                            </button>
                            <button className="btn btn-primary" onClick={handleGoToDashboard}>
                                View Dashboard →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
