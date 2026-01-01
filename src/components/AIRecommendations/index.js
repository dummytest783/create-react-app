import React from "react";
import HeroDecisionCard from "./HeroDecisionCard";
import ScoreDashboard from "./ScoreDashboard";
import SummaryGrid from "./SummaryGrid";
import DetailedAnalysis from "./DetailedAnalysis";
import "./index.css";

const AIRecommendations = ({ AIRecommendationsData }) => {
  if (!AIRecommendationsData) {
    return <div className="ai-recommendations">No data available</div>;
  }

  // Extract the ticker from the data
  const tickers = Object.keys(AIRecommendationsData);
  if (tickers.length === 0) {
    return <div className="ai-recommendations">No stock data available</div>;
  }

  const tickerKey = tickers[0];
  const stockData = AIRecommendationsData[tickerKey];

  // Debug: Log the stock data structure
  console.log('Stock Data:', stockData);

  // Validate required data exists
  if (!stockData || !stockData.detailed_analysis || !stockData.summary) {
    return (
      <div className="ai-recommendations">
        <p>Error: Invalid data structure received from API</p>
        <p>Expected structure with ticker, summary, and detailed_analysis</p>
        <pre style={{ color: '#fff', background: '#000', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(AIRecommendationsData, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="ai-recommendations-new">
      <HeroDecisionCard
        ticker={stockData.ticker}
        finalDecision={stockData.final_decision}
        overallScore={stockData.overall_score}
        confidence={stockData.confidence}
      />

      <ScoreDashboard detailedAnalysis={stockData.detailed_analysis} />

      <SummaryGrid summary={stockData.summary} />

      <DetailedAnalysis detailedAnalysis={stockData.detailed_analysis} />
    </div>
  );
};

export default AIRecommendations;
