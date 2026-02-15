import React, { useState } from "react";
import { getAgentConfig } from "./councilUtils";
import AgentDetailModal from "./AgentDetailModal";
import "./AgentNetworkImproved.css";

// Professional icons - minimal emoji usage
const AI_AGENT_ICONS = {
  valuation: "📊",
  profitability: "💰",
  moat: "🛡️",
  news: "📰",
  risk: "⚠️",
};

// Agent specialization descriptions
const AGENT_SPECIALIZATIONS = {
  valuation: "Price Analysis Expert",
  profitability: "Profit Performance Specialist",
  moat: "Competitive Advantage Analyst",
  news: "Market Sentiment Monitor",
  risk: "Financial Health Assessor"
};

const MethodologySection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="methodology-section">
      <button
        className="methodology-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="toggle-icon">{expanded ? '−' : '+'}</span>
        <span className="toggle-text">How This Analysis Works</span>
      </button>

      {expanded && (
        <div className="methodology-content">
          <div className="methodology-grid">
            <div className="methodology-item">
              <h4>Data Sources</h4>
              <ul>
                <li>Real-time financial data from SEC filings</li>
                <li>Market sentiment from news aggregators</li>
                <li>Historical price and volume data</li>
                <li>Analyst consensus and institutional holdings</li>
              </ul>
            </div>

            <div className="methodology-item">
              <h4>Analysis Process</h4>
              <ol>
                <li>Each agent analyzes specific metrics independently</li>
                <li>Scores are calculated using weighted algorithms</li>
                <li>Agents provide reasoning based on data findings</li>
                <li>Collective decision aggregates all perspectives</li>
              </ol>
            </div>

            <div className="methodology-item">
              <h4>Score Breakdown</h4>
              <ul>
                <li><strong>80-100:</strong> Strong positive signals</li>
                <li><strong>60-79:</strong> Generally favorable</li>
                <li><strong>40-59:</strong> Neutral/Mixed signals</li>
                <li><strong>20-39:</strong> Concerning indicators</li>
                <li><strong>0-19:</strong> Critical issues detected</li>
              </ul>
            </div>

            <div className="methodology-item">
              <h4>Confidence Level</h4>
              <p>Confidence is determined by:</p>
              <ul>
                <li>Agreement level between agents</li>
                <li>Data quality and completeness</li>
                <li>Market volatility factors</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AgentCard = ({ agentType, score, data, onClick, isActive, showConnection }) => {
  const config = getAgentConfig(agentType, score, data);
  const stance = config.getStance(score);

  const getScoreColor = (score) => {
    if (score >= 75) return '#4ade80'; // Green
    if (score >= 50) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  // Calculate connection strength based on score
  const connectionStrength = score / 100;
  const lineWidth = Math.max(2, connectionStrength * 6);
  const lineOpacity = Math.max(0.3, connectionStrength);

  return (
    <div className="agent-card-wrapper">
      {/* Connection line to center */}
      {showConnection && (
        <div className="agent-connection">
          <div
            className="connection-line"
            style={{
              width: `${lineWidth}px`,
              opacity: lineOpacity,
              background: `linear-gradient(180deg, ${config.color} 0%, transparent 100%)`
            }}
          >
            <div className="data-flow" style={{
              background: `linear-gradient(180deg, transparent 0%, ${config.color} 50%, transparent 100%)`
            }}></div>
          </div>
          <div className="connection-dot" style={{
            background: config.color,
            boxShadow: `0 0 10px ${config.color}, 0 0 20px ${config.color}40`,
            width: `${8 + connectionStrength * 4}px`,
            height: `${8 + connectionStrength * 4}px`
          }}></div>
        </div>
      )}

      <div
        className={`agent-card ${isActive ? 'active' : ''}`}
        onClick={onClick}
        style={{ borderLeftColor: config.color }}
      >
        <div className="agent-card-header">
          <div className="agent-card-icon">
            <span className="agent-ai-icon">{AI_AGENT_ICONS[agentType]}</span>
          </div>
          <div className="agent-card-info">
            <h3 className="agent-card-name">{config.name}</h3>
            <p className="agent-specialization">{AGENT_SPECIALIZATIONS[agentType]}</p>
          </div>
          <div className="agent-card-score" style={{
            backgroundColor: getScoreColor(score),
            boxShadow: `0 0 20px ${getScoreColor(score)}40`
          }}>
            <div className="score-value">{score}</div>
            <div className="score-label">Score</div>
          </div>
        </div>

        {/* Stance/Recommendation */}
        <div className="agent-stance-section">
          <span className="stance-label">Recommendation:</span>
          <span className="stance-value" style={{ color: config.color }}>
            {stance.emoji} {stance.text}
          </span>
        </div>

        {/* Key insight preview - always show for consistent height */}
        <div className="key-insight-preview">
          <div className="insight-label">Key Insight:</div>
          {data?.key_reason ? (
            <div className="insight-text">
              {data.key_reason.length > 100
                ? `${data.key_reason.substring(0, 100)}...`
                : data.key_reason}
            </div>
          ) : (
            <div className="insight-text-placeholder">
              Click "View Full Analysis" to see detailed reasoning and metrics
            </div>
          )}
        </div>

        <div className="agent-card-cta">
          <button className="cta-button">
            <span className="cta-text">View Full Analysis</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MainAIDecision = ({ ticker, finalDecision, overallScore, confidence, agents }) => {
  const getDecisionColor = (decision) => {
    if (decision.toLowerCase() === 'buy') return '#4ade80';
    if (decision.toLowerCase() === 'sell') return '#ef4444';
    return '#fbbf24';
  };

  const decisionColor = getDecisionColor(finalDecision);

  return (
    <div className="main-ai-decision">
      <div className="decision-header-section">
        <h2 className="decision-title">Collective Recommendation</h2>
        <p className="decision-subtitle">
          Based on comprehensive analysis from {agents.length} specialized agents
        </p>
      </div>

      <div className="ai-decision-card">
        <div className="decision-main" style={{
          backgroundColor: `${decisionColor}15`,
          borderColor: decisionColor
        }}>
          <div className="decision-label">Final Recommendation</div>
          <div className="decision-value" style={{ color: decisionColor }}>
            {finalDecision.toUpperCase()}
          </div>
          <div className="decision-metrics-row">
            <div className="decision-metric">
              <span className="metric-value" style={{ color: decisionColor }}>{overallScore}</span>
              <span className="metric-label">/100</span>
            </div>
            <div className="decision-metric">
              <span className="metric-label">Confidence:</span>
              <span className="metric-value">{confidence}</span>
            </div>
          </div>
        </div>

        <div className="decision-context">
          <p className="context-explanation">
            This recommendation synthesizes insights from {agents.length} independent analysis perspectives,
            each examining different aspects of {ticker}'s fundamentals, market position, and risk profile.
          </p>
        </div>
      </div>
    </div>
  );
};

const AgentNetworkImproved = ({ ticker, finalDecision, overallScore, confidence, detailedAnalysis }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agents = [
    {
      type: 'risk',
      score: detailedAnalysis.risk?.score || 0,
      data: detailedAnalysis.risk,
    },
    {
      type: 'news',
      score: detailedAnalysis.news?.score || 0,
      data: detailedAnalysis.news,
    },
    {
      type: 'profitability',
      score: detailedAnalysis.profitability?.score || 0,
      data: detailedAnalysis.profitability,
    },
    {
      type: 'moat',
      score: detailedAnalysis.moat?.score || 0,
      data: detailedAnalysis.moat,
    },
    {
      type: 'valuation',
      score: detailedAnalysis.valuation?.score || 0,
      data: detailedAnalysis.valuation,
    },
  ];

  const handleAgentClick = (agentType, score, data) => {
    setSelectedAgent({ type: agentType, score, data });
  };

  const closeModal = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="agent-network-improved">
      {/* Header */}
      <div className="network-hero-section">
        <h1 className="hero-title">AI Stock Analysis: {ticker}</h1>
        <p className="hero-subtitle">
          Multi-perspective analysis combining fundamental metrics, market sentiment, and risk assessment
        </p>
      </div>

      {/* Methodology explanation */}
      <MethodologySection />

      {/* Collective Recommendation - SHOWN FIRST */}
      <MainAIDecision
        ticker={ticker}
        finalDecision={finalDecision}
        overallScore={overallScore}
        confidence={confidence}
        agents={agents}
      />

      {/* Individual Agent Analysis */}
      <div className="agent-grid-section">
        <div className="section-header">
          <h2 className="section-title">Individual Agent Analyses</h2>
          <p className="section-subtitle">
            Each agent independently evaluates specific aspects of {ticker}.
            Click any card to see detailed reasoning and data sources.
          </p>
        </div>

        <div className="agent-cards-grid">
          {agents.map((agent) => (
            <AgentCard
              key={agent.type}
              agentType={agent.type}
              score={agent.score}
              data={agent.data}
              onClick={() => handleAgentClick(agent.type, agent.score, agent.data)}
              isActive={selectedAgent?.type === agent.type}
              showConnection={false}
            />
          ))}
        </div>
      </div>

      {selectedAgent && (
        <AgentDetailModal
          agentType={selectedAgent.type}
          score={selectedAgent.score}
          data={selectedAgent.data}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AgentNetworkImproved;
