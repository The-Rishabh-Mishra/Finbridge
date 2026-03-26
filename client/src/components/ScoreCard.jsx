import React from 'react';

export default function ScoreCard({ score, scoreInsight, previousScore, trend, trendPercentage }) {
  const insight = scoreInsight || {
    category: score >= 750 ? 'Excellent' : score >= 650 ? 'Good' : 'Fair',
    color: score >= 750 ? '#27ae60' : score >= 650 ? '#f39c12' : '#e74c3c',
    description: 'Your credit profile is being analyzed',
    loanEligibility: 'Check back for updates',
  };

  return (
    <div className="score-card ai-enhanced">
      <div className="score-display">
        <div className="score-circle" style={{ borderColor: insight.color, boxShadow: `0 0 20px ${insight.color}40` }}>
          <span className="score-value">{score}</span>
          <span className="score-label">/ 900</span>
        </div>
        {trend && (
          <div className="trend-indicator" style={{ color: trend === 'up' ? '#27ae60' : '#e74c3c' }}>
            {trend === 'up' ? '📈' : '📉'} {trendPercentage}%
          </div>
        )}
      </div>

      <div className="score-info">
        <div className="score-header">
          <h3>Credit Score</h3>
          <span className="score-category" style={{ backgroundColor: insight.color }}>
            {insight.category}
          </span>
        </div>

        <p className="score-description">{insight.description}</p>

        {previousScore && (
          <div className="score-comparison">
            <div className="comparison-item">
              <span className="label">Previous</span>
              <span className="value">{previousScore}</span>
            </div>
            <div className="comparison-arrow">→</div>
            <div className="comparison-item">
              <span className="label">Current</span>
              <span className="value" style={{ color: insight.color }}>{score}</span>
            </div>
          </div>
        )}

        <div className="score-insight">
          <h4>💡 AI Insight</h4>
          <p>{insight.loanEligibility}</p>
        </div>

        <div className="score-action">
          <button className="btn-secondary">View Detailed Analysis</button>
        </div>
      </div>
    </div>
  );
}


// ScoreCard.jsx
// Receives raw form data, runs the FICO/CIBIL formula internally,
// and renders the full score card + 5-factor breakdown.

// Props:
//   data  — object from CibilDataForm's onSubmit
//   onBack — callback to go back to the form




// import { useEffect, useState } from "react";

// // ── FICO Scoring Engine ────────────────────────────────────────────────────────

// function calcPaymentHistoryScore(onTime, total) {
//   if (!total) return 0;
//   const r = onTime / total;
//   if (r >= 0.99) return 100;
//   if (r >= 0.95) return 85;
//   if (r >= 0.90) return 70;
//   if (r >= 0.80) return 50;
//   if (r >= 0.70) return 30;
//   return 10;
// }

// function calcUtilizationScore(used, limit) {
//   if (!limit) return 0;
//   const pct = (used / limit) * 100;
//   if (pct <= 10) return 100;
//   if (pct <= 20) return 90;
//   if (pct <= 30) return 75;
//   if (pct <= 40) return 55;
//   if (pct <= 50) return 35;
//   if (pct <= 75) return 15;
//   return 5;
// }

// function calcHistoryScore(years) {
//   const y = Number(years);
//   if (y >= 10) return 100;
//   if (y >= 7) return 85;
//   if (y >= 5) return 70;
//   if (y >= 3) return 50;
//   if (y >= 1) return 30;
//   return 10;
// }

// function calcCreditMixScore(types) {
//   const n = types.length;
//   if (n >= 4) return 100;
//   if (n === 3) return 80;
//   if (n === 2) return 55;
//   if (n === 1) return 30;
//   return 0;
// }

// function calcInquiryScore(inquiries) {
//   const n = Number(inquiries);
//   if (n === 0) return 100;
//   if (n === 1) return 85;
//   if (n === 2) return 65;
//   if (n === 3) return 45;
//   if (n <= 5) return 25;
//   return 5;
// }

// function computeScore(data) {
//   const ph  = calcPaymentHistoryScore(Number(data.onTimePayments), Number(data.totalPayments));
//   const ut  = calcUtilizationScore(Number(data.creditUsed), Number(data.creditLimit));
//   const hi  = calcHistoryScore(data.creditAgeYears);
//   const mix = calcCreditMixScore(data.creditTypes);
//   const inq = calcInquiryScore(data.hardInquiries);

//   // FICO weights: 35 / 30 / 15 / 10 / 10
//   const weighted = ph * 0.35 + ut * 0.30 + hi * 0.15 + mix * 0.10 + inq * 0.10;
//   const cibil = Math.round(300 + (weighted / 100) * 600);

//   const utilRatio = data.creditLimit > 0
//     ? ((data.creditUsed / data.creditLimit) * 100).toFixed(1)
//     : "0.0";

//   return {
//     cibil,
//     factors: [
//       {
//         key: "paymentHistory",
//         label: "Payment History",
//         score: ph,
//         weight: 35,
//         color: "#6366f1",
//         detail: `${data.onTimePayments} of ${data.totalPayments} payments on time (${((data.onTimePayments / data.totalPayments) * 100).toFixed(1)}%)`,
//         tip: ph >= 85
//           ? "Excellent! You consistently pay on time."
//           : ph >= 65
//           ? "Good, but a few missed payments hurt your score."
//           : "Missed payments are the biggest score killer — prioritise on-time repayment.",
//       },
//       {
//         key: "utilization",
//         label: "Credit Utilization",
//         score: ut,
//         weight: 30,
//         color: "#0ea5e9",
//         detail: `₹${Number(data.creditUsed).toLocaleString("en-IN")} used of ₹${Number(data.creditLimit).toLocaleString("en-IN")} limit (${utilRatio}%)`,
//         tip: ut >= 85
//           ? "Outstanding utilization — well below 30%."
//           : ut >= 55
//           ? "Decent, but bringing it below 30% will boost your score."
//           : "High utilization signals risk to lenders. Try to pay down balances.",
//       },
//       {
//         key: "history",
//         label: "Credit History Length",
//         score: hi,
//         weight: 15,
//         color: "#10b981",
//         detail: `${data.creditAgeYears} year${data.creditAgeYears == 1 ? "" : "s"} of credit history`,
//         tip: hi >= 85
//           ? "Long credit history adds significant trust."
//           : hi >= 50
//           ? "Solid history. Keep old accounts open to grow this further."
//           : "Short history is fine — it will improve naturally over time.",
//       },
//       {
//         key: "mix",
//         label: "Credit Mix",
//         score: mix,
//         weight: 10,
//         color: "#f59e0b",
//         detail: `${data.creditTypes.length} type${data.creditTypes.length !== 1 ? "s" : ""}: ${data.creditTypes.join(", ").replace(/_/g, " ")}`,
//         tip: mix >= 80
//           ? "Great mix! Diverse credit shows responsible management."
//           : mix >= 55
//           ? "Decent mix. Adding one more type (e.g. an installment loan) would help."
//           : "Limited mix. A healthy combination of credit types improves your profile.",
//       },
//       {
//         key: "inquiries",
//         label: "New Hard Inquiries",
//         score: inq,
//         weight: 10,
//         color: "#ec4899",
//         detail: `${data.hardInquiries} hard inquir${data.hardInquiries == 1 ? "y" : "ies"} in last 12 months`,
//         tip: inq >= 85
//           ? "Minimal inquiries — you look financially stable to lenders."
//           : inq >= 65
//           ? "A couple of inquiries are fine. Avoid new applications for now."
//           : "Too many inquiries in a short time signals credit hunger to lenders.",
//       },
//     ],
//   };
// }

// function getBand(score) {
//   if (score >= 800) return { label: "EXCELLENT",  color: "#00c9a7", glow: "#00c9a740", desc: "You have an exceptional credit profile. You qualify for the best loan rates and premium credit products." };
//   if (score >= 750) return { label: "VERY GOOD",  color: "#3b82f6", glow: "#3b82f640", desc: "Strong credit profile. Most lenders will offer you competitive rates with favorable terms." };
//   if (score >= 700) return { label: "GOOD",        color: "#f59e0b", glow: "#f59e0b40", desc: "Decent credit profile. Lenders view you as an acceptable risk. Some premium products may require improvement." };
//   if (score >= 650) return { label: "FAIR",        color: "#f97316", glow: "#f9731640", desc: "Below-average profile. You may get approved but at higher interest rates. Focus on key improvement areas." };
//   return              { label: "POOR",        color: "#ef4444", glow: "#ef444440", desc: "Significant credit issues present. Work on paying on time and reducing utilization urgently." };
// }

// function getFactorBand(score) {
//   if (score >= 85) return { label: "EXCELLENT", color: "#00c9a7" };
//   if (score >= 65) return { label: "GOOD",       color: "#f59e0b" };
//   if (score >= 40) return { label: "FAIR",        color: "#f97316" };
//   return                   { label: "POOR",        color: "#ef4444" };
// }

// // ── Animated counter ──────────────────────────────────────────────────────────
// function Counter({ to, duration = 1400 }) {
//   const [val, setVal] = useState(300);
//   useEffect(() => {
//     let start = null;
//     const tick = (ts) => {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / duration, 1);
//       const eased = 1 - Math.pow(1 - p, 4);
//       setVal(Math.round(300 + (to - 300) * eased));
//       if (p < 1) requestAnimationFrame(tick);
//     };
//     requestAnimationFrame(tick);
//   }, [to, duration]);
//   return <>{val}</>;
// }

// // ── Arc gauge ─────────────────────────────────────────────────────────────────
// function ArcGauge({ score, color, glow }) {
//   const R = 90, stroke = 12;
//   const r = R - stroke / 2;
//   const circ = 2 * Math.PI * r;
//   const pct = (score - 300) / 600;
//   const [animated, setAnimated] = useState(0);

//   useEffect(() => {
//     let start = null;
//     const tick = (ts) => {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / 1400, 1);
//       const eased = 1 - Math.pow(1 - p, 4);
//       setAnimated(eased * pct);
//       if (p < 1) requestAnimationFrame(tick);
//     };
//     requestAnimationFrame(tick);
//   }, [score, pct]);

//   const offset = circ * (1 - animated);

//   return (
//     <svg width={R * 2 + 20} height={R * 2 + 20} style={{ display: "block" }}>
//       <defs>
//         <filter id="glow">
//           <feGaussianBlur stdDeviation="4" result="blur" />
//           <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
//         </filter>
//       </defs>
//       {/* track */}
//       <circle cx={R + 10} cy={R + 10} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
//       {/* progress */}
//       <circle
//         cx={R + 10} cy={R + 10} r={r}
//         fill="none"
//         stroke={color}
//         strokeWidth={stroke}
//         strokeDasharray={circ}
//         strokeDashoffset={offset}
//         strokeLinecap="round"
//         transform={`rotate(-90 ${R + 10} ${R + 10})`}
//         filter="url(#glow)"
//         style={{ transition: "stroke 0.4s" }}
//       />
//     </svg>
//   );
// }

// // ── Bar ───────────────────────────────────────────────────────────────────────
// function Bar({ value, color }) {
//   const [width, setWidth] = useState(0);
//   useEffect(() => {
//     const t = setTimeout(() => setWidth(value), 100);
//     return () => clearTimeout(t);
//   }, [value]);
//   return (
//     <div style={barStyles.track}>
//       <div
//         style={{
//           ...barStyles.fill,
//           width: `${width}%`,
//           background: `linear-gradient(90deg, ${color}88, ${color})`,
//         }}
//       />
//     </div>
//   );
// }
// const barStyles = {
//   track: { height: 6, background: "#1e293b", borderRadius: 99, overflow: "hidden" },
//   fill: { height: "100%", borderRadius: 99, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)" },
// };

// // ── Main ScoreCard ────────────────────────────────────────────────────────────
// export default function ScoreCard({ data, onBack }) {
//   const { cibil, factors } = computeScore(data);
//   const band = getBand(cibil);

//   return (
//     <div style={S.wrapper}>
//       <style>{css}</style>

//       {/* ── Hero ── */}
//       <div style={S.hero}>
//         <div style={S.heroLeft}>
//           <div style={S.backBtn} onClick={onBack} className="back-btn">← Recalculate</div>
//           <p style={S.heroEyebrow}>YOUR CIBIL SCORE</p>
//           <div style={S.scoreRow}>
//             <span style={{ ...S.scoreNum, color: band.color, textShadow: `0 0 40px ${band.glow}` }}>
//               <Counter to={cibil} />
//             </span>
//             <span style={S.scoreMax}>/900</span>
//             <span style={{ ...S.badge, background: band.color + "22", color: band.color }}>
//               {band.label}
//             </span>
//           </div>
//           <p style={S.bandDesc}>{band.desc}</p>

//           {/* range bar */}
//           <div style={S.rangeWrap}>
//             {[
//               { label: "Poor", from: 300, to: 549, color: "#ef4444" },
//               { label: "Fair", from: 550, to: 649, color: "#f97316" },
//               { label: "Good", from: 650, to: 749, color: "#f59e0b" },
//               { label: "Very Good", from: 750, to: 799, color: "#3b82f6" },
//               { label: "Excellent", from: 800, to: 900, color: "#00c9a7" },
//             ].map((seg) => (
//               <div key={seg.label} style={S.rangeSegWrap}>
//                 <div
//                   style={{
//                     ...S.rangeSeg,
//                     background: seg.color,
//                     opacity: cibil >= seg.from && cibil <= seg.to ? 1 : 0.25,
//                   }}
//                 />
//                 <span style={{ ...S.rangeLabel, color: cibil >= seg.from && cibil <= seg.to ? seg.color : "#334155" }}>
//                   {seg.label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={S.gaugeWrap}>
//           <div style={{ position: "relative" }}>
//             <ArcGauge score={cibil} color={band.color} glow={band.glow} />
//             <div style={{ ...S.gaugeCenter, color: band.color }}>
//               <Counter to={cibil} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── 5-Factor Breakdown ── */}
//       <div style={S.sectionTitle}>Score Breakdown — FICO Model</div>
//       <div style={S.factorGrid}>
//         {factors.map((f) => {
//           const fb = getFactorBand(f.score);
//           return (
//             <div key={f.key} style={{ ...S.factorCard, borderTopColor: f.color }} className="factor-card">
//               <div style={S.factorTop}>
//                 <div>
//                   <p style={S.factorLabel}>{f.label}</p>
//                   <span style={{ ...S.factorBadge, background: fb.color + "22", color: fb.color }}>
//                     {fb.label}
//                   </span>
//                 </div>
//                 <div style={{ textAlign: "right" }}>
//                   <p style={{ ...S.factorScore, color: f.color }}>{f.score}</p>
//                   <p style={S.factorWeight}>Weight {f.weight}%</p>
//                 </div>
//               </div>
//               <Bar value={f.score} color={f.color} />
//               <p style={S.factorDetail}>{f.detail}</p>
//               <p style={S.factorTip}>💡 {f.tip}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ── Styles ────────────────────────────────────────────────────────────────────
// const S = {
//   wrapper: {
//     fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//     background: "#0b1120",
//     color: "#e2e8f0",
//     minHeight: "100vh",
//     padding: "2.5rem 1.5rem",
//     maxWidth: 900,
//     margin: "0 auto",
//   },
//   hero: {
//     display: "flex",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     gap: "2rem",
//     background: "#111827",
//     border: "1px solid #1e293b",
//     borderRadius: 16,
//     padding: "2rem 2.2rem",
//     marginBottom: "2rem",
//     flexWrap: "wrap",
//   },
//   heroLeft: { flex: 1, minWidth: 260 },
//   backBtn: {
//     display: "inline-block",
//     fontSize: "0.8rem",
//     color: "#475569",
//     cursor: "pointer",
//     marginBottom: 14,
//     letterSpacing: "0.3px",
//   },
//   heroEyebrow: {
//     fontSize: "0.68rem",
//     fontWeight: 800,
//     letterSpacing: "2.5px",
//     color: "#475569",
//     margin: "0 0 8px",
//   },
//   scoreRow: { display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 10 },
//   scoreNum: { fontSize: "4rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1 },
//   scoreMax: { fontSize: "1.3rem", color: "#334155", fontWeight: 700 },
//   badge: {
//     fontSize: "0.72rem",
//     fontWeight: 800,
//     letterSpacing: "1.5px",
//     padding: "4px 12px",
//     borderRadius: 20,
//     alignSelf: "center",
//   },
//   bandDesc: { fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, marginBottom: 20, maxWidth: 380 },
//   rangeWrap: { display: "flex", gap: 4 },
//   rangeSegWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 },
//   rangeSeg: { height: 6, width: "100%", borderRadius: 99, transition: "opacity 0.4s" },
//   rangeLabel: { fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.5px", textAlign: "center", transition: "color 0.4s" },
//   gaugeWrap: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     flexShrink: 0,
//   },
//   gaugeCenter: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     fontSize: "1.8rem",
//     fontWeight: 800,
//     letterSpacing: "-1px",
//   },
//   sectionTitle: {
//     fontSize: "0.72rem",
//     fontWeight: 800,
//     letterSpacing: "2px",
//     color: "#475569",
//     textTransform: "uppercase",
//     marginBottom: 14,
//   },
//   factorGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//     gap: "1rem",
//   },
//   factorCard: {
//     background: "#111827",
//     border: "1px solid #1e293b",
//     borderTop: "3px solid",
//     borderRadius: 12,
//     padding: "1.2rem 1.3rem",
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//     transition: "transform 0.2s, box-shadow 0.2s",
//   },
//   factorTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
//   factorLabel: { fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9", margin: "0 0 5px" },
//   factorBadge: { fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1px", padding: "2px 8px", borderRadius: 20 },
//   factorScore: { fontSize: "1.5rem", fontWeight: 800, margin: 0, lineHeight: 1 },
//   factorWeight: { fontSize: "0.7rem", color: "#475569", margin: "2px 0 0", textAlign: "right" },
//   factorDetail: { fontSize: "0.78rem", color: "#64748b", margin: 0, lineHeight: 1.5 },
//   factorTip: { fontSize: "0.78rem", color: "#94a3b8", margin: 0, lineHeight: 1.5, borderTop: "1px solid #1e293b", paddingTop: 8 },
// };

// const css = `
//   .back-btn:hover { color: #94a3b8 !important; }
//   .factor-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px #00000040; }
//   @media (max-width: 600px) {
//     .hero { flex-direction: column !important; }
//   }
// `;
