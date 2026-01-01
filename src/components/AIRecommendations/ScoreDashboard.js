import React from "react";
import "./ScoreDashboard.css";

const ScoreCard = ({ title, score, status }) => {
  const getScoreColor = (score) => {
    if (score >= 75) return '#4ade80';
    if (score >= 50) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="score-card">
      <div className="score-card-title">{title}</div>
      <div className="score-card-value" style={{ color: getScoreColor(score) }}>
        {score}
      </div>
      <div className="score-card-status">
        {status}
      </div>
      <div className="score-bar">
        <div
          className="score-bar-fill"
          style={{
            width: `${score}%`,
            backgroundColor: getScoreColor(score)
          }}
        ></div>
      </div>
    </div>
  );
};

const ScoreDashboard = ({ detailedAnalysis }) => {
  return (
    <div className="score-dashboard">
      <ScoreCard
        title="Valuation"
        score={detailedAnalysis.valuation.valuation_score}
        status={detailedAnalysis.valuation.valuation_status}
      />
      <ScoreCard
        title="Profitability"
        score={detailedAnalysis.profitability.profitability_score}
        status={detailedAnalysis.profitability.profitability_strength}
      />
      <ScoreCard
        title="Moat"
        score={detailedAnalysis.moat.moat_score}
        status={detailedAnalysis.moat.moat_strength}
      />
      <ScoreCard
        title="News"
        score={detailedAnalysis.news.news_score}
        status={detailedAnalysis.news.news_sentiment}
      />
      <ScoreCard
        title="Risk"
        score={detailedAnalysis.risk.risk_score}
        status={detailedAnalysis.risk.risk_level}
      />
    </div>
  );
};

export default ScoreDashboard;
