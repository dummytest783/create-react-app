
import './index.css'

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        console.log('payload ', payload[0]);
        const growthPercentage = payload[0].payload.percentage;
        return (
          <div className="custom-tooltip">
            <p>{`${payload[0].payload.date}`}</p>
            <p>{`Value: ${payload[0].value}`}</p>
            <p>{growthPercentage && `Growth: ${growthPercentage}`}</p>
          </div>
        );
    }
    
    return null;
  }
  export default CustomTooltip;