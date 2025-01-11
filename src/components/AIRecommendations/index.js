import React, { useEffect, useState } from "react";
import "./index.css"; // Updated styles

const AIRecommendations = ({ inputTickers }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [fundamentals, setFundamentals] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inputTickers.length === 0) {
      console.warn("No tickers provided. Skipping API call.");
      setLoading(false);
      return;
    }
  
    const tickersQuery = inputTickers.join(",");
    fetch(`https://python-web-service-dqjy.onrender.com/analyze-stocks?tickers=${tickersQuery}`)
      .then((response) => response.json())
      .then((data) => {
        const messages = data.messages;
  
        const toolCallMapping = messages
          .find((msg) => msg.role === "assistant" && msg.tool_calls)
          ?.tool_calls.reduce((acc, call) => {
            const functionName = call.function.name;
            acc[call.id] = functionName;
            return acc;
          }, {});
  
        const recommendationData = [];
        const fundamentalData = [];
  
        messages
          .filter((msg) => msg.role === "tool")
          .forEach((toolMsg) => {
            const functionName = toolCallMapping?.[toolMsg.tool_call_id];
            const parsedContent = JSON.parse(toolMsg.content);
  
            if (functionName === "get_analyst_recommendations") {
              const tickerIndex = recommendationData.length; // Use the index to map to inputTickers
              const symbol = inputTickers[tickerIndex];
              if (symbol) {
                recommendationData.push({ symbol, ...parsedContent["0"] });
              }
            }
  
            if (functionName === "get_stock_fundamentals") {
              fundamentalData.push(parsedContent);
            }
          });
  
        const assistantMessage = messages.find((msg) => msg.role === "assistant" && msg.content);
        if (assistantMessage) {
          setSummary(assistantMessage.content);
        }
  
        setRecommendations(recommendationData);
        setFundamentals(fundamentalData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [inputTickers]);
  

  if (loading) {
    return <div className="loading">Loading AI Recommendations...</div>;
  }

  return (
    <div className="ai-recommendations">
      <h1 className="title">AI Stock Recommendations</h1>

      <section className="summary-section">
        <h2>Summary</h2>
        <p className="summary">{summary}</p>
      </section>

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
    </div>
  );
};

export default AIRecommendations;
