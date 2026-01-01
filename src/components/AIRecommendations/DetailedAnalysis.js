import React, { useState } from "react";
import "./DetailedAnalysis.css";

const AccordionItem = ({ title, badges, children, isExpanded, onToggle }) => {
  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={onToggle}>
        <div className="accordion-title">
          {title}
          {badges && badges.map((badge, index) => (
            <span key={index} className="accordion-badge">
              {badge}
            </span>
          ))}
        </div>
        <span className="accordion-toggle">{isExpanded ? '−' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

const DetailSection = ({ title, content }) => {
  return (
    <div className="detail-section">
      <strong>{title}:</strong>
      {typeof content === 'string' ? (
        <p>{content}</p>
      ) : (
        content
      )}
    </div>
  );
};

const DetailedAnalysis = ({ detailedAnalysis }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="detailed-analysis">
      <h2 className="section-header">Detailed Analysis</h2>

      {/* Valuation */}
      <AccordionItem
        title="Valuation Analysis"
        badges={[detailedAnalysis.valuation.valuation_status]}
        isExpanded={expandedSections.valuation}
        onToggle={() => toggleSection('valuation')}
      >
        <DetailSection title="Key Reason" content={detailedAnalysis.valuation.key_reason} />
        <DetailSection title="Detailed Reasoning" content={detailedAnalysis.valuation.detailed_reasoning} />
      </AccordionItem>

      {/* Profitability */}
      <AccordionItem
        title="Profitability Analysis"
        badges={[
          detailedAnalysis.profitability.profitability_strength,
          detailedAnalysis.profitability.trend
        ]}
        isExpanded={expandedSections.profitability}
        onToggle={() => toggleSection('profitability')}
      >
        <DetailSection title="Key Reason" content={detailedAnalysis.profitability.key_reason} />
        <DetailSection title="Detailed Reasoning" content={detailedAnalysis.profitability.detailed_reasoning} />
      </AccordionItem>

      {/* Moat */}
      <AccordionItem
        title="Economic Moat Analysis"
        badges={[detailedAnalysis.moat.moat_strength]}
        isExpanded={expandedSections.moat}
        onToggle={() => toggleSection('moat')}
      >
        <DetailSection title="Justification" content={detailedAnalysis.moat.justification} />
        <DetailSection title="Detailed Reasoning" content={detailedAnalysis.moat.detailed_reasoning} />
      </AccordionItem>

      {/* News */}
      <AccordionItem
        title="News & Sentiment Analysis"
        badges={[detailedAnalysis.news.news_sentiment]}
        isExpanded={expandedSections.news}
        onToggle={() => toggleSection('news')}
      >
        <DetailSection
          title="Key Events"
          content={
            <ul className="key-events-list">
              {detailedAnalysis.news.key_events.map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          }
        />
        <DetailSection title="Impact Assessment" content={detailedAnalysis.news.impact_assessment} />
        <DetailSection title="Detailed Reasoning" content={detailedAnalysis.news.detailed_reasoning} />
      </AccordionItem>

      {/* Risk */}
      <AccordionItem
        title="Risk Analysis"
        badges={[`${detailedAnalysis.risk.risk_level} Risk`]}
        isExpanded={expandedSections.risk}
        onToggle={() => toggleSection('risk')}
      >
        <DetailSection title="Key Risk Reason" content={detailedAnalysis.risk.key_risk_reason} />
        <DetailSection title="Detailed Reasoning" content={detailedAnalysis.risk.detailed_reasoning} />
      </AccordionItem>
    </div>
  );
};

export default DetailedAnalysis;
