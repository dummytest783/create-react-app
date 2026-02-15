import React from "react";
import { getAgentConfig } from "./councilUtils";
import "./AgentDetailModal.css";

const AgentDetailModal = ({ agentType, score, data, onClose }) => {
  const config = getAgentConfig(agentType, score, data);
  const stance = config.getStance(score);
  const voice = config.getVoice(score, data);
  const openingStatement = config.getOpeningStatement(data);
  const keyMetrics = config.getKeyMetrics(data);

  // Stop event propagation when clicking inside the modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="agent-modal-overlay" onClick={onClose}>
      <div className="agent-modal" onClick={handleModalClick} style={{ borderTopColor: config.color }}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <div className="modal-header-top">
            <div className="modal-icon" style={{ backgroundColor: config.color }}>
              {config.icon}
            </div>
            <div className="modal-header-text">
              <div className="modal-title-row">
                <h2 className="modal-title">{config.name}</h2>
                <div className="modal-score-badge" style={{ backgroundColor: config.color }}>
                  <div className="badge-score">{score}</div>
                </div>
              </div>
              <div className="modal-recommendation">{voice}</div>
            </div>
          </div>
          <div className="modal-stance-row">
            <div className="badge-stance" style={{ color: config.color }}>
              {stance.emoji} {stance.text}
            </div>
          </div>
        </div>

        <div className="modal-content">
          <div className="modal-section">
            <h3>💬 Agent's Perspective</h3>
            <div className="perspective-box">
              <p className="opening-quote">"{openingStatement}"</p>
            </div>
          </div>

          {keyMetrics && keyMetrics.length > 0 && (
            <div className="modal-section">
              <h3>📊 Key Metrics</h3>
              <ul className="metrics-list">
                {keyMetrics.map((metric, index) => (
                  <li key={index}>{metric}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-section">
            <h3>📝 Detailed Analysis</h3>
            <div className="analysis-box">
              {data.key_reason && (
                <div className="analysis-item">
                  <strong>Key Reason:</strong>
                  <p>{data.key_reason}</p>
                </div>
              )}
              {data.detailed_reasoning && (
                <div className="analysis-item">
                  <strong>Detailed Reasoning:</strong>
                  <p>{data.detailed_reasoning}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailModal;
