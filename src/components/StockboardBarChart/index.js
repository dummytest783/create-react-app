import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {numberFormater} from '../../utils'
import CustomTooltip from '../CustomTooltip';
import './index.css'

function StockboardBarChart({data, tickerName}) {
    const isMobile = window.innerWidth < 768;
    const [clickedIndex, setClickedIndex] = useState(null);

    const handleBarClick = (_, index) => {
        if (isMobile) {
            setClickedIndex(clickedIndex === index ? null : index);
        }
    };

    return (
        <div className='chartLayout'>
            {isMobile && clickedIndex !== null && data[clickedIndex] && (
                <div className='mobile-percentage-display'>
                    <div className="tooltip-year">{data[clickedIndex].date}</div>
                    <div className="tooltip-value">
                        Value: {data[clickedIndex].value?.toLocaleString()}
                    </div>
                    {data[clickedIndex].percentage ? (
                        <div className={`tooltip-growth ${parseFloat(data[clickedIndex].percentage) >= 0 ? 'positive' : 'negative'}`}>
                            <span className="growth-label">YoY Growth:</span>
                            <span className="growth-value">{data[clickedIndex].percentage}</span>
                        </div>
                    ) : (
                        <div className="tooltip-growth no-data">
                            <span>No prior year data</span>
                        </div>
                    )}
                </div>
            )}
            <div className='barChartContainer' id="barChartContainer">
                <ResponsiveContainer>
                    <BarChart width={100} height={300} data={data}
                        margin={{
                        top: 30,
                        right: isMobile ? 10 : 30,
                        left: isMobile ? 10 : 30,
                        bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" style={{ fontSize: isMobile ? '12px' : '14px' }} />
                        <YAxis tickFormatter={numberFormater} style={{ fontSize: isMobile ? '12px' : '14px' }} />
                        <Tooltip  content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }} />
                        <Legend verticalAlign="bottom"/>
                        <Bar
                            dataKey="value"
                            fill="#8884d8"
                            onClick={handleBarClick}
                            style={{ cursor: isMobile ? 'pointer' : 'default' }}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={clickedIndex === index ? '#5a56d6' : '#8884d8'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className='companyLabel'>  {tickerName} </div>
        </div>
    )
  }
  export default StockboardBarChart;