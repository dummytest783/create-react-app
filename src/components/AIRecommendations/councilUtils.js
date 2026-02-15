// Agent configuration and utility functions for AI Council

export const getAgentConfig = (agentType, score, data) => {
  const configs = {
    valuation: {
      name: 'Valuation Agent',
      icon: '📊',
      color: '#ff6b6b',
      personality: 'skeptical',
      getStance: (score) => {
        if (score >= 70) return { emoji: '✅', text: 'Bullish', recommendation: 'BUY' };
        if (score >= 40) return { emoji: '⚠️', text: 'Cautious', recommendation: 'CAUTION' };
        return { emoji: '❌', text: 'Bearish', recommendation: 'SELL' };
      },
      getVoice: (score, data) => {
        const stance = configs.valuation.getStance(score);
        if (stance.recommendation === 'SELL' || stance.recommendation === 'CAUTION') {
          return "I must raise concerns";
        }
        return "I recommend BUY";
      },
      getOpeningStatement: (data) => {
        const { key_reason } = data;
        return key_reason || "Analyzing valuation metrics to determine if the stock price is justified.";
      },
      getKeyMetrics: (data) => {
        return [
          `Status: ${data.status || 'N/A'}`,
          `Analysis based on price multiples, growth rates, and intrinsic value calculations`
        ].filter(m => m);
      }
    },
    profitability: {
      name: 'Profitability Agent',
      icon: '💰',
      color: '#51cf66',
      personality: 'enthusiastic',
      getStance: (score) => {
        if (score >= 80) return { emoji: '✅', text: 'Bullish', recommendation: 'BUY' };
        if (score >= 60) return { emoji: '👍', text: 'Positive', recommendation: 'BUY' };
        if (score >= 40) return { emoji: '⚠️', text: 'Neutral', recommendation: 'HOLD' };
        return { emoji: '👎', text: 'Negative', recommendation: 'SELL' };
      },
      getVoice: (score) => {
        if (score >= 80) return "I strongly recommend BUY";
        if (score >= 60) return "I recommend BUY";
        return "I'm cautious";
      },
      getOpeningStatement: (data) => {
        const { key_reason, status } = data;
        if (status === 'Strong') {
          return key_reason || "This company demonstrates exceptional profitability with industry-leading margins.";
        }
        return key_reason || "Analyzing the company's ability to convert revenue into profit.";
      },
      getKeyMetrics: (data) => {
        return [
          `Status: ${data.status || 'N/A'}`,
          `Analysis based on margins, returns on capital, and earnings quality`
        ].filter(m => m);
      }
    },
    moat: {
      name: 'Moat Agent',
      icon: '🛡️',
      color: '#4dabf7',
      personality: 'strategic',
      getStance: (score) => {
        if (score >= 80) return { emoji: '✅', text: 'Bullish', recommendation: 'BUY' };
        if (score >= 60) return { emoji: '👍', text: 'Positive', recommendation: 'BUY' };
        if (score >= 40) return { emoji: '⚠️', text: 'Neutral', recommendation: 'HOLD' };
        return { emoji: '👎', text: 'Weak', recommendation: 'SELL' };
      },
      getVoice: (score) => {
        if (score >= 80) return "I recommend BUY";
        if (score >= 60) return "I'm moderately positive";
        return "I see risks";
      },
      getOpeningStatement: (data) => {
        const { key_reason, status } = data;
        if (status === 'Strong') {
          return key_reason || "This company has built a fortress with durable competitive advantages.";
        }
        return key_reason || "Evaluating the company's competitive positioning and defensibility.";
      },
      getKeyMetrics: (data) => {
        return [
          `Status: ${data.status || 'N/A'}`,
          `Analysis based on network effects, switching costs, brand power, and scale advantages`
        ].filter(m => m);
      }
    },
    news: {
      name: 'News & Sentiment Agent',
      icon: '📰',
      color: '#9775fa',
      personality: 'market-focused',
      getStance: (score) => {
        if (score >= 75) return { emoji: '✅', text: 'Bullish', recommendation: 'BUY' };
        if (score >= 50) return { emoji: '👍', text: 'Positive', recommendation: 'BUY' };
        if (score >= 35) return { emoji: '⚠️', text: 'Neutral', recommendation: 'HOLD' };
        return { emoji: '👎', text: 'Negative', recommendation: 'SELL' };
      },
      getVoice: (score) => {
        if (score >= 75) return "I recommend BUY";
        if (score >= 50) return "I'm cautiously optimistic";
        return "I see headwinds";
      },
      getOpeningStatement: (data) => {
        const { key_reason, status } = data;
        if (status === 'Positive') {
          return key_reason || "The market is showing strong positive sentiment toward this stock.";
        }
        return key_reason || "Analyzing recent news and market sentiment.";
      },
      getKeyMetrics: (data) => {
        return [
          `Status: ${data.status || 'N/A'}`,
          `Analysis based on recent news events, analyst sentiment, and market reactions`
        ].filter(m => m);
      }
    },
    risk: {
      name: 'Risk Agent',
      icon: '⚡',
      color: '#20c997',
      personality: 'cautious',
      getStance: (score) => {
        // For risk, higher score = lower risk = bullish
        if (score >= 80) return { emoji: '✅', text: 'Bullish', recommendation: 'BUY' };
        if (score >= 60) return { emoji: '👍', text: 'Positive', recommendation: 'BUY' };
        if (score >= 40) return { emoji: '⚠️', text: 'Cautious', recommendation: 'HOLD' };
        return { emoji: '❌', text: 'High Risk', recommendation: 'SELL' };
      },
      getVoice: (score) => {
        if (score >= 80) return "I recommend BUY";
        if (score >= 60) return "I'm moderately comfortable";
        return "I'm concerned about risks";
      },
      getOpeningStatement: (data) => {
        const { key_reason, status } = data;
        if (status === 'Low') {
          return key_reason || "From a risk perspective, this company shows a strong balance sheet with minimal concerns.";
        }
        return key_reason || "Evaluating financial health and risk factors.";
      },
      getKeyMetrics: (data) => {
        return [
          `Status: ${data.status || 'N/A'}`,
          `Analysis based on debt levels, liquidity ratios, and financial stability`
        ].filter(m => m);
      }
    }
  };

  return configs[agentType];
};

export const getAgentRecommendation = (agentType, score, data) => {
  const config = getAgentConfig(agentType, score, data);
  if (!config) return { recommendation: 'HOLD', emoji: '⚠️', text: 'Neutral' };

  return config.getStance(score);
};

export const calculateVoteBreakdown = (detailedAnalysis) => {
  const agents = [
    { name: 'valuation', score: detailedAnalysis.valuation?.score || 0, data: detailedAnalysis.valuation },
    { name: 'profitability', score: detailedAnalysis.profitability?.score || 0, data: detailedAnalysis.profitability },
    { name: 'moat', score: detailedAnalysis.moat?.score || 0, data: detailedAnalysis.moat },
    { name: 'news', score: detailedAnalysis.news?.score || 0, data: detailedAnalysis.news },
    { name: 'risk', score: detailedAnalysis.risk?.score || 0, data: detailedAnalysis.risk },
  ];

  const votes = { BUY: [], HOLD: [], SELL: [] };

  agents.forEach(agent => {
    const recommendation = getAgentRecommendation(agent.name, agent.score, agent.data);
    if (recommendation.recommendation === 'BUY') {
      votes.BUY.push(agent.name);
    } else if (recommendation.recommendation === 'SELL' || recommendation.recommendation === 'CAUTION') {
      votes.SELL.push(agent.name);
    } else {
      votes.HOLD.push(agent.name);
    }
  });

  return {
    buy: votes.BUY.length,
    hold: votes.HOLD.length,
    sell: votes.SELL.length,
    buyAgents: votes.BUY,
    holdAgents: votes.HOLD,
    sellAgents: votes.SELL,
    total: agents.length
  };
};

export const getAgentsList = () => [
  'valuation',
  'profitability',
  'moat',
  'news',
  'risk'
];
