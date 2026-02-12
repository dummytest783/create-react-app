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
        const metrics = data.metrics || {};
        return [
          `P/E Ratio: ${metrics.pe_ratio || 'N/A'}${metrics.sector_median_pe ? ` vs Sector ${metrics.sector_median_pe}` : ''}`,
          `PEG Ratio: ${metrics.peg_ratio || 'N/A'}`,
          `${data.valuation_status || 'Status'}: ${metrics.discount_premium_pct ? `${metrics.discount_premium_pct > 0 ? '+' : ''}${metrics.discount_premium_pct}%` : ''}`
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
        const { key_reason, profitability_strength } = data;
        if (profitability_strength === 'Strong') {
          return key_reason || "This company demonstrates exceptional profitability with industry-leading margins.";
        }
        return key_reason || "Analyzing the company's ability to convert revenue into profit.";
      },
      getKeyMetrics: (data) => {
        const margins = data.margins_ttm || {};
        const returns = data.returns || {};
        return [
          margins.gross_margin_pct ? `Gross Margin: ${margins.gross_margin_pct.toFixed(1)}%` : null,
          margins.operating_margin_pct ? `Operating Margin: ${margins.operating_margin_pct.toFixed(1)}%` : null,
          returns.roe_pct ? `ROE: ${returns.roe_pct.toFixed(1)}%` : null,
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
        const { justification, moat_strength } = data;
        if (moat_strength === 'Strong') {
          return justification || "This company has built a fortress with durable competitive advantages.";
        }
        return justification || "Evaluating the company's competitive positioning and defensibility.";
      },
      getKeyMetrics: (data) => {
        const sources = data.moat_sources || {};
        const topSources = Object.entries(sources)
          .filter(([_, value]) => value && value.score >= 4)
          .sort((a, b) => b[1].score - a[1].score)
          .slice(0, 3)
          .map(([key, _]) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

        return topSources.length > 0
          ? [`Strong moat sources: ${topSources.join(', ')}`]
          : ['Analyzing competitive advantages'];
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
        const { impact_assessment, news_sentiment } = data;
        if (news_sentiment === 'Positive') {
          return impact_assessment || "The market is showing strong positive sentiment toward this stock.";
        }
        return impact_assessment || "Analyzing recent news and market sentiment.";
      },
      getKeyMetrics: (data) => {
        const events = data.key_events || [];
        if (events.length > 0) {
          return events.slice(0, 3).map(event => {
            if (typeof event === 'string') return event;
            return event.headline || event;
          });
        }
        return ['Recent sentiment: ' + (data.news_sentiment || 'Neutral')];
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
        const { key_risk_reason, risk_level } = data;
        if (risk_level === 'Low') {
          return key_risk_reason || "From a risk perspective, this company shows a strong balance sheet with minimal concerns.";
        }
        return key_risk_reason || "Evaluating financial health and risk factors.";
      },
      getKeyMetrics: (data) => {
        const ratios = data.key_ratios || {};
        const debtMetrics = data.debt_metrics || {};
        return [
          ratios.debt_to_equity ? `Debt-to-Equity: ${ratios.debt_to_equity.toFixed(2)}` : null,
          debtMetrics.net_debt && debtMetrics.net_debt < 0 ? 'Net Cash Position' : null,
          ratios.current_ratio ? `Current Ratio: ${ratios.current_ratio.toFixed(2)}` : null,
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
    { name: 'valuation', score: detailedAnalysis.valuation?.valuation_score || 0, data: detailedAnalysis.valuation },
    { name: 'profitability', score: detailedAnalysis.profitability?.profitability_score || 0, data: detailedAnalysis.profitability },
    { name: 'moat', score: detailedAnalysis.moat?.moat_score || 0, data: detailedAnalysis.moat },
    { name: 'news', score: detailedAnalysis.news?.news_score || 0, data: detailedAnalysis.news },
    { name: 'risk', score: detailedAnalysis.risk?.risk_score || 0, data: detailedAnalysis.risk },
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
