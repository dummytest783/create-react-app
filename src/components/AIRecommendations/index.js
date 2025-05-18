import React from "react";
import "./index.css";

const AIRecommendations = ({ AIRecommendationsData }) => {
  if (!AIRecommendationsData) {
    return <div className="ai-recommendations">No data available</div>;
  }

  // Extract the ticker from the data (using the first one from the object keys)
  const tickers = Object.keys(AIRecommendationsData);
  if (tickers.length === 0) {
    return <div className="ai-recommendations">No stock data available</div>;
  }

  // For now, we'll just show data for the first ticker
  const tickerKey = tickers[0];
  const stockData = AIRecommendationsData[tickerKey];

  return (
    <div className="ai-recommendations">
      <h1 className="title">AI Stock Analysis</h1>

      <section className="stock-info-section">
        <h2>Stock Information</h2>
        <div className="info-card">
          <p><strong>Ticker:</strong> {stockData.ticker.toUpperCase()}</p>
          <p><strong>Analysis Date:</strong> {stockData.analysis_date}</p>
        </div>
      </section>

      <section className="trends-section">
        <h2>Five Year Trends</h2>
        
        <h3>Revenue Growth</h3>
        <div className="table-container">
          <table className="trends-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Growth Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stockData.five_year_trends.revenue_growth.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.growth_percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Net Income Growth</h3>
        <div className="table-container">
          <table className="trends-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Growth Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stockData.five_year_trends.net_income_growth.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.growth_percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="competitors-section">
        <h2>Top Competitors</h2>
        <div className="table-container">
          <table className="competitors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Ticker</th>
                <th>Exchange</th>
                <th>Industry</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {stockData.top_competitors.map((competitor, index) => (
                <tr key={index}>
                  <td>{competitor.name}</td>
                  <td>{competitor.ticker}</td>
                  <td>{competitor.exchange}</td>
                  <td>{competitor.industry}</td>
                  <td>{competitor.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="business-summary-section">
        <h2>Business Moat Summary</h2>
        <p className="summary">{stockData.business_moat_summary}</p>
      </section>

      <section className="recent-developments-section">
        <h2>Recent Developments</h2>
        <p className="summary">{stockData.recent_developments}</p>
      </section>

      <section className="valuation-section">
        <h2>Valuation Metrics</h2>
        <div className="table-container">
          <table className="valuation-table">
            <tbody>
              <tr>
                <th>PE Ratio</th>
                <td>{stockData.valuation_metrics.pe_ratio}</td>
              </tr>
              <tr>
                <th>Industry Avg PE</th>
                <td>{stockData.valuation_metrics.industry_avg_pe}</td>
              </tr>
              <tr>
                <th>Price to Book</th>
                <td>{stockData.valuation_metrics.price_to_book}</td>
              </tr>
              <tr>
                <th>Price to Sales</th>
                <td>{stockData.valuation_metrics.price_to_sales?.toFixed(2) || "N/A"}</td>
              </tr>
              <tr>
                <th>Market Cap</th>
                <td>{stockData.valuation_metrics.market_cap}</td>
              </tr>
              <tr>
                <th>Dividend Yield</th>
                <td>{stockData.valuation_metrics.dividend_yield}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="valuation-summary-section">
        <h2>Valuation Summary</h2>
        <p className="summary">{stockData.valuation_summary}</p>
      </section>

      <section className="risk-summary-section">
        <h2>Risk Summary</h2>
        <p className="summary">{stockData.risk_summary}</p>
      </section>
    </div>
  );
};

export default AIRecommendations;
