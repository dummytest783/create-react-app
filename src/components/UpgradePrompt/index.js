import React from 'react';
import './UpgradePrompt.css';

const UpgradePrompt = () => {
  return (
    <div className="upgrade-prompt-container">
      <div className="upgrade-prompt-card">
        <div className="lock-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
          </svg>
        </div>

        <h2 className="upgrade-title">Your Personal AI Analyst Team</h2>
        <p className="upgrade-subtitle">A squad of specialized AI agents working together to analyze every angle of your investment</p>

        <div className="features-list">
          <div className="feature-item">
            <span className="checkmark">💼</span>
            <span><strong>Profitability Agent:</strong> Deep-dives into earnings, margins & growth trajectories</span>
          </div>
          <div className="feature-item">
            <span className="checkmark">💰</span>
            <span><strong>Valuation Expert:</strong> Determines if you're paying a fair price or overpaying</span>
          </div>
          <div className="feature-item">
            <span className="checkmark">🛡️</span>
            <span><strong>Risk Analyst:</strong> Uncovers financial red flags & debt concerns before you invest</span>
          </div>
          <div className="feature-item">
            <span className="checkmark">📰</span>
            <span><strong>News Intelligence:</strong> Scans market sentiment & breaking developments in real-time</span>
          </div>
          <div className="feature-item">
            <span className="checkmark">🎯</span>
            <span><strong>Decision Synthesizer:</strong> Combines all insights into clear BUY/HOLD/SELL recommendations</span>
          </div>
        </div>

        <div className="pricing-section">
          <div className="contact-info">
            <p className="contact-title">Stop Guessing. Start Investing with Confidence.</p>
            <p className="contact-subtitle">Let our AI agents do the heavy lifting while you make smarter decisions</p>
          </div>
        </div>

        <div className="contact-details">
          <div className="contact-person">
            <span className="person-icon">👨‍💼</span>
            <span className="person-name">Abdullah Abbasi</span>
          </div>
          <a href="tel:+16197735739" className="upgrade-button">
            <span className="button-icon">📞</span>
            +1 (619) 773-5739
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
