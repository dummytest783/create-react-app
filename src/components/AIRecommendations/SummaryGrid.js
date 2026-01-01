import React from "react";
import "./SummaryGrid.css";

const SummaryCard = ({ title, text }) => {
  return (
    <div className="summary-card">
      <div className="summary-title">{title}</div>
      <p className="summary-text">{text}</p>
    </div>
  );
};

const SummaryGrid = ({ summary }) => {
  return (
    <div className="summary-grid">
      <SummaryCard title="Valuation" text={summary.valuation} />
      <SummaryCard title="Profitability" text={summary.profitability} />
      <SummaryCard title="Moat" text={summary.moat} />
      <SummaryCard title="News" text={summary.news} />
      <SummaryCard title="Risk" text={summary.risk} />
    </div>
  );
};

export default SummaryGrid;
