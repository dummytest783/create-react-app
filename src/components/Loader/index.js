import React, { useState, useEffect } from 'react';
import './index.scss';

const stockFacts = [
  {
    title: "Warren Buffett's Golden Rule",
    fact: "Price is what you pay, value is what you get. Always invest in companies you understand.",
    icon: "💡"
  },
  {
    title: "The Power of Compounding",
    fact: "A $10,000 investment growing at 10% annually becomes $67,275 in 20 years.",
    icon: "📈"
  },
  {
    title: "P/E Ratio Insight",
    fact: "A P/E ratio below 15 often indicates undervalued stocks, but always compare within the same industry.",
    icon: "🔍"
  },
  {
    title: "Dividend Advantage",
    fact: "Companies that consistently pay dividends tend to be more stable and shareholder-friendly.",
    icon: "💰"
  },
  {
    title: "Cash Flow is King",
    fact: "Free cash flow is often more important than earnings. It shows real money the company generates.",
    icon: "💵"
  },
  {
    title: "Diversification Matters",
    fact: "Don't put all eggs in one basket. Spread investments across 15-20 stocks in different sectors.",
    icon: "🎯"
  },
  {
    title: "Time in Market > Timing",
    fact: "Staying invested for the long term beats trying to time the market perfectly.",
    icon: "⏰"
  },
  {
    title: "Debt-to-Equity Ratio",
    fact: "A ratio below 2 is generally healthy. Lower debt means less financial risk.",
    icon: "⚖️"
  },
  {
    title: "Market Psychology",
    fact: "Be fearful when others are greedy, and greedy when others are fearful. - Warren Buffett",
    icon: "🧠"
  },
  {
    title: "ROE (Return on Equity)",
    fact: "Companies with ROE above 15% are typically good at generating returns from shareholders' equity.",
    icon: "🎓"
  }
];

const Loader = ({ message = "Loading..." }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);

      setTimeout(() => {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % stockFacts.length);
        setFadeIn(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentFact = stockFacts[currentFactIndex];

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="spinner-wrapper">
          <div className="spinner-outer">
            <div className="spinner-inner"></div>
          </div>
          <div className="pulse-ring"></div>
        </div>

        <p className="loader-text">{message}</p>

        <div className={`fact-card ${fadeIn ? 'fade-in' : 'fade-out'}`}>
          <div className="fact-icon">{currentFact.icon}</div>
          <h3 className="fact-title">{currentFact.title}</h3>
          <p className="fact-text">{currentFact.fact}</p>
        </div>

        <div className="progress-dots">
          {stockFacts.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentFactIndex ? 'active' : ''}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;