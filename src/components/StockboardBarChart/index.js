import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {numberFormater} from '../../utils'
import CustomTooltip from '../CustomTooltip';
import './index.css'

function StockboardBarChart({data, tickerName}) {
    const charSize = window.innerWidth < 450 ? '350px' : '800px';
    return (
        <div className='chartLayout'>
            <div className='barChartContainer' id="barChartContainer" style={{width: charSize}}> 
                <ResponsiveContainer>
                    <BarChart width={100} height={300} data={data}
                        margin={{
                        top: 30,
                        right: 30,
                        left: 30,
                        bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={numberFormater}  />
                        <Tooltip  content={<CustomTooltip />}/>
                        <Legend verticalAlign="bottom"/>
                        <Bar dataKey="value" fill="#8884d8"  />
                    </BarChart>
                </ResponsiveContainer> 
            </div>
            <div className='companyLabel'>  {tickerName} </div>
        </div>
    )
  }
  export default StockboardBarChart;