import './index.css'

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const growthPercentage = payload[0].payload.percentage;
        const value = payload[0].value;
        const date = payload[0].payload.date;

        return (
          <div className="custom-tooltip">
            <div className="tooltip-year">{date}</div>
            <div className="tooltip-value">Value: {value?.toLocaleString()}</div>
            {growthPercentage && (
              <div className={`tooltip-growth ${parseFloat(growthPercentage) >= 0 ? 'positive' : 'negative'}`}>
                <span className="growth-label">YoY Growth:</span>
                <span className="growth-value">{growthPercentage}</span>
              </div>
            )}
          </div>
        );
    }

    return null;
  }
  export default CustomTooltip;