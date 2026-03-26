/**
 * CIBIL Score Calculation Service
 * Calculates scores based on actual user input, not random data
 * Stores per-user calculation results
 */

// Calculation functions (same as in Cibilcalculator.jsx)
export const calcPaymentHistoryScore = (onTime, total) => {
    if (!total) return 0;
    const r = onTime / total;
    if (r >= 0.99) return 100;
    if (r >= 0.95) return 85;
    if (r >= 0.90) return 70;
    if (r >= 0.80) return 50;
    if (r >= 0.70) return 30;
    return 10;
};

export const calcUtilizationScore = (used, limit) => {
    if (!limit) return 0;
    const p = (used / limit) * 100;
    if (p <= 10) return 100;
    if (p <= 20) return 90;
    if (p <= 30) return 75;
    if (p <= 40) return 55;
    if (p <= 50) return 35;
    if (p <= 75) return 15;
    return 5;
};

export const calcHistoryScore = (years) => {
    const y = Number(years);
    if (y >= 10) return 100;
    if (y >= 7) return 85;
    if (y >= 5) return 70;
    if (y >= 3) return 50;
    if (y >= 1) return 30;
    return 10;
};

export const calcCreditMixScore = (types) => {
    const n = types.length;
    if (n >= 4) return 100;
    if (n === 3) return 80;
    if (n === 2) return 55;
    if (n === 1) return 30;
    return 0;
};

export const calcInquiryScore = (inquiries) => {
    const n = Number(inquiries);
    if (n === 0) return 100;
    if (n === 1) return 85;
    if (n === 2) return 65;
    if (n === 3) return 45;
    if (n <= 5) return 25;
    return 5;
};

export const computeScore = (data) => {
    const ph = calcPaymentHistoryScore(Number(data.onTimePayments), Number(data.totalPayments));
    const ut = calcUtilizationScore(Number(data.creditUsed), Number(data.creditLimit));
    const hi = calcHistoryScore(data.creditAgeYears);
    const mix = calcCreditMixScore(data.creditTypes);
    const inq = calcInquiryScore(data.hardInquiries);

    const weighted = ph * 0.35 + ut * 0.30 + hi * 0.15 + mix * 0.10 + inq * 0.10;
    const cibil = Math.round(300 + (weighted / 100) * 600);

    return {
        cibil,
        factors: [
            {
                key: "ph",
                label: "Payment History",
                score: ph,
                weight: 35,
                color: "#818cf8",
                detail: `${data.onTimePayments} of ${data.totalPayments} payments on time (${((Number(data.onTimePayments) / Number(data.totalPayments)) * 100).toFixed(1)}%)`,
                tip: ph >= 85 ? "Consistently paying on time. Excellent!" : ph >= 65 ? "A few missed payments are hurting you." : "Missed payments are the biggest score killer.",
            },
            {
                key: "ut",
                label: "Credit Utilization",
                score: ut,
                weight: 30,
                color: "#38bdf8",
                detail: `₹${Number(data.creditUsed).toLocaleString("en-IN")} used of ₹${Number(data.creditLimit).toLocaleString("en-IN")} (${((data.creditUsed / data.creditLimit) * 100).toFixed(1)}%)`,
                tip: ut >= 85 ? "Outstanding — well below 30%." : ut >= 55 ? "Decent. Aim to bring below 30%." : "High utilization signals risk. Pay down balances.",
            },
            {
                key: "hi",
                label: "Credit History Length",
                score: hi,
                weight: 15,
                color: "#34d399",
                detail: `${data.creditAgeYears} year${data.creditAgeYears == 1 ? "" : "s"} of credit history`,
                tip: hi >= 85 ? "Long history builds strong trust." : hi >= 50 ? "Keep old accounts open to grow this." : "Short history — it improves naturally over time.",
            },
            {
                key: "mix",
                label: "Credit Mix",
                score: mix,
                weight: 10,
                color: "#fbbf24",
                detail: `${data.creditTypes.length} type(s): ${data.creditTypes.map(t => t.replace(/_/g, " ")).join(", ")}`,
                tip: mix >= 80 ? "Great mix of credit types!" : mix >= 55 ? "Add one more type to improve." : "Limited mix. A broader portfolio helps.",
            },
            {
                key: "inq",
                label: "New Hard Inquiries",
                score: inq,
                weight: 10,
                color: "#f472b6",
                detail: `${data.hardInquiries} hard inquir${data.hardInquiries == 1 ? "y" : "ies"} in last 12 months`,
                tip: inq >= 85 ? "Minimal inquiries — you look stable." : inq >= 65 ? "A couple is fine. Avoid new applications." : "Too many inquiries signals credit hunger.",
            },
        ],
    };
};

export const getBand = (score) => {
    if (score >= 800) return { label: "EXCELLENT", color: "#00c9a7" };
    if (score >= 750) return { label: "VERY GOOD", color: "#00d084" };
    if (score >= 700) return { label: "GOOD", color: "#3b82f6" };
    if (score >= 650) return { label: "FAIR", color: "#f59e0b" };
    return { label: "POOR", color: "#ef4444" };
};

// Storage functions
const STORAGE_PREFIX = "FinBridge_cibil_";
const CALCULATION_HISTORY_PREFIX = "FinBridge_cibil_history_";

export const getStorageKey = (userId) => `${STORAGE_PREFIX}${userId}`;
export const getHistoryStorageKey = (userId) => `${CALCULATION_HISTORY_PREFIX}${userId}`;

/**
 * Save user's CIBIL calculation data
 */
export const saveCIBILData = (userId, formData, scoreResult) => {
    try {
        const dataToSave = {
            formData,
            scoreResult,
            timestamp: new Date().toISOString(),
            version: "1.0",
        };

        // Save current calculation
        localStorage.setItem(getStorageKey(userId), JSON.stringify(dataToSave));

        // Save to history
        const historyKey = getHistoryStorageKey(userId);
        const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
        history.unshift(dataToSave);
        // Keep only last 12 calculations
        if (history.length > 12) history.pop();
        localStorage.setItem(historyKey, JSON.stringify(history));

        return true;
    } catch (error) {
        console.error("Error saving CIBIL data:", error);
        return false;
    }
};

/**
 * Get user's latest CIBIL calculation
 */
export const getCIBILData = (userId) => {
    try {
        const stored = localStorage.getItem(getStorageKey(userId));
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    } catch (error) {
        console.error("Error retrieving CIBIL data:", error);
        return null;
    }
};

/**
 * Get user's CIBIL calculation history
 */
export const getCIBILHistory = (userId) => {
    try {
        const stored = localStorage.getItem(getHistoryStorageKey(userId));
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    } catch (error) {
        console.error("Error retrieving CIBIL history:", error);
        return [];
    }
};

/**
 * Generate dashboard data from latest CIBIL calculation
 */
export const generateDashboardDataFromCIBIL = (userId, userData = {}) => {
    const cibilData = getCIBILData(userId);
    const history = getCIBILHistory(userId);

    if (!cibilData) {
        // No CIBIL data yet - return default structure
        return {
            user: {
                id: userId,
                name: userData.name || "User",
                email: userData.email || "user@example.com",
                phone: userData.phone || "Not provided",
                createdAt: userData.createdAt || new Date().toISOString(),
                isActive: true,
                profileCompleted: userData.profileCompleted || 0,
            },
            creditScore: 0,
            scoreInsight: "No CIBIL score calculated yet. Complete the calculator to get started.",
            previousScore: 0,
            scoreHistory: [],
            trend: "stable",
            trendPercentage: 0,
            creditFactors: [],
            aiRecommendations: [],
            loanSuggestions: [],
            recentTransactions: [],
            accountHealth: {
                score: 0,
                status: "Not Calculated",
                lastUpdated: new Date().toISOString(),
                assessments: [],
            },
        };
    }

    // Generate score history from calculations
    const scoreHistory = history.map((calc) => ({
        date: new Date(calc.timestamp).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }),
        score: calc.scoreResult.cibil,
    }));

    const previousScore = history.length > 1 ? history[1].scoreResult.cibil : cibilData.scoreResult.cibil;
    const currentScore = cibilData.scoreResult.cibil;
    const scoreDiff = currentScore - previousScore;
    const trend = scoreDiff > 0 ? "up" : scoreDiff < 0 ? "down" : "stable";
    const trendPercentage = previousScore ? ((scoreDiff / previousScore) * 100).toFixed(1) : 0;

    return {
        user: {
            id: userId,
            name: userData.name || "User",
            email: userData.email || "user@example.com",
            phone: userData.phone || "Not provided",
            createdAt: userData.createdAt || new Date().toISOString(),
            isActive: true,
            profileCompleted: userData.profileCompleted || 100,
        },
        creditScore: currentScore,
        scoreInsight: getScoreInsight(currentScore),
        previousScore,
        scoreHistory: scoreHistory.reverse(),
        trend,
        trendPercentage: Math.abs(Number(trendPercentage)),
        creditFactors: cibilData.scoreResult.factors,
        aiRecommendations: generateRecommendations(cibilData.scoreResult.factors),
        loanSuggestions: generateLoanSuggestions(currentScore),
        recentTransactions: generateRecentTransactions(cibilData.formData),
        accountHealth: {
            score: Math.round((cibilData.scoreResult.factors.reduce((sum, f) => sum + (f.score / 100) * f.weight, 0)) / cibilData.scoreResult.factors.length),
            status: getBand(currentScore).label,
            lastUpdated: cibilData.timestamp,
            assessments: cibilData.scoreResult.factors.map((f) => ({ name: f.label, score: f.score })),
        },
    };
};

const getScoreInsight = (score) => {
    const band = getBand(score);
    const insights = {
        EXCELLENT: "Your credit profile is excellent. You qualify for the best rates available.",
        "VERY GOOD": "Your credit is very good. You should get competitive rates from most lenders.",
        GOOD: "Your credit is good. You qualify for standard rates. Room for improvement.",
        FAIR: "Your credit is fair. Limited options. Focus on making on-time payments.",
        POOR: "Your credit needs improvement. Very limited options at high rates.",
    };
    return insights[band.label] || "Calculate your CIBIL score to see insights.";
};

const generateRecommendations = (factors) => {
    const recommendations = [];

    // Payment history recommendation
    const phFactor = factors.find((f) => f.key === "ph");
    if (phFactor && phFactor.score < 85) {
        recommendations.push({
            id: "rec_1",
            priority: "High",
            title: "Improve Payment History",
            description: phFactor.tip,
            estimatedImpact: `+${100 - phFactor.score} points`,
            timeframe: "6-12 months",
            difficulty: "Medium",
            icon: "✅",
            aiReasoning: "Payment history is 35% of your score. Start making all payments on time.",
        });
    }

    // Utilization recommendation
    const utFactor = factors.find((f) => f.key === "ut");
    if (utFactor && utFactor.score < 85) {
        recommendations.push({
            id: "rec_2",
            priority: utFactor.score < 55 ? "High" : "Medium",
            title: "Reduce Credit Utilization",
            description: utFactor.tip,
            estimatedImpact: `+${Math.round((100 - utFactor.score) * 0.3)} points`,
            timeframe: "1-2 months",
            difficulty: "Easy",
            icon: "💳",
            aiReasoning: "Aim to keep utilization below 30% for maximum score impact.",
        });
    }

    // Credit mix recommendation
    const mixFactor = factors.find((f) => f.key === "mix");
    if (mixFactor && mixFactor.score < 100) {
        recommendations.push({
            id: "rec_3",
            priority: "Low",
            title: "Diversify Credit Mix",
            description: mixFactor.tip,
            estimatedImpact: `+${100 - mixFactor.score} points`,
            timeframe: "6-12 months",
            difficulty: "Hard",
            icon: "🔄",
            aiReasoning: "Different credit types show you can manage various debt responsibly.",
        });
    }

    return recommendations;
};

const generateLoanSuggestions = (score) => {
    const suggestions = [];

    if (score >= 750) {
        suggestions.push({
            id: "LOAN001",
            type: "Personal Loan",
            amount: 500000,
            interestRate: 8.5,
            tenure: 60,
            recommendation: "Recommended",
            color: "#27ae60",
            eligibilityScore: 95,
        });
    }

    if (score >= 700) {
        suggestions.push({
            id: "LOAN002",
            type: "Home Loan",
            amount: 2000000,
            interestRate: 6.5,
            tenure: 240,
            recommendation: "Available",
            color: "#f39c12",
            eligibilityScore: 88,
        });
    }

    if (score >= 650) {
        suggestions.push({
            id: "LOAN003",
            type: "Business Loan",
            amount: 1000000,
            interestRate: 9.5,
            tenure: 84,
            recommendation: "Available",
            color: "#3498db",
            eligibilityScore: 82,
        });
    }

    return suggestions;
};

const generateRecentTransactions = (formData) => {
    return [
        {
            id: "TXN001",
            type: "Payment",
            description: `Last EMI Payment (${formData.onTimePayments} on-time out of ${formData.totalPayments})`,
            amount: formData.creditUsed ? -Math.round(formData.creditUsed * 0.1) : 0,
            date: new Date().toISOString().split("T")[0],
            status: "Completed",
        },
        {
            id: "TXN002",
            type: "Balance",
            description: `Current Credit Utilization (${((formData.creditUsed / formData.creditLimit) * 100).toFixed(1)}%)`,
            amount: formData.creditUsed,
            date: new Date().toISOString().split("T")[0],
            status: "Active",
        },
    ];
};
