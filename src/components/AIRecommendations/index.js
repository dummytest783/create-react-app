import React, { useEffect, useState } from "react";
import "./index.css"; // Updated styles

const AIRecommendations = ({ AIRecommendationsData : { summary, recommendations, fundamentals } }) => {
  console.log('AIRecommendationsData:', { summary, recommendations, fundamentals });
  return (
    <div className="ai-recommendations">
      <h1 className="title">AI Stock Recommendations</h1>

      <section className="recommendations-section">
        <h2>Analyst Recommendations</h2>
        <div className="table-container">
          <table className="recommendations-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Strong Buy</th>
                <th>Buy</th>
                <th>Hold</th>
                <th>Sell</th>
                <th>Strong Sell</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, index) => (
                <tr key={index}>
                  <td>{rec.symbol}</td>
                  <td>{rec.strongBuy}</td>
                  <td>{rec.buy}</td>
                  <td>{rec.hold}</td>
                  <td>{rec.sell}</td>
                  <td>{rec.strongSell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="fundamentals-section">
        <h2>Stock Fundamentals</h2>
        <div className="table-container">
          <table className="fundamentals-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Company Name</th>
                <th>Sector</th>
                <th>Industry</th>
                <th>Market Cap</th>
                <th>PE Ratio</th>
                <th>PB Ratio</th>
                <th>Dividend Yield</th>
                <th>EPS</th>
                <th>Beta</th>
                <th>52-Week High</th>
                <th>52-Week Low</th>
              </tr>
            </thead>
            <tbody>
              {fundamentals.map((fund, index) => (
                <tr key={index}>
                  <td>{fund.symbol}</td>
                  <td>{fund.company_name}</td>
                  <td>{fund.sector}</td>
                  <td>{fund.industry}</td>
                  <td>{fund.market_cap.toLocaleString()}</td>
                  <td>{fund.pe_ratio.toFixed(2)}</td>
                  <td>{fund.pb_ratio.toFixed(2)}</td>
                  <td>{(fund.dividend_yield * 100).toFixed(2)}%</td>
                  <td>{fund.eps.toFixed(2)}</td>
                  <td>{fund.beta.toFixed(2)}</td>
                  <td>{fund["52_week_high"].toFixed(2)}</td>
                  <td>{fund["52_week_low"].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="summary-section">
        <h2>Summary</h2>
        <p className="summary">{summary}</p>
      </section>
    </div>
  );
};

export default AIRecommendations;
