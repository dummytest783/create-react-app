import React from "react";
import "./HeroDecisionCard.css";

const HeroDecisionCard = ({ ticker, finalDecision, overallScore, confidence }) => {
  return (
    <div className="hero-card">
      <div className="hero-content">
        <div className="ticker-badge">{ticker}</div>
        <div className="decision-label">AI Stock Advisor</div>
        <div className="decision-value">
          {finalDecision?.toUpperCase()}
        </div>
        <div className="confidence-container">
          <div className="confidence-label">
            Confidence: <span className="confidence-value">{confidence}</span>
          </div>
          <div className="overall-score">
            <div className="score-number">{overallScore}</div>
            <div className="score-label">Overall Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDecisionCard;
