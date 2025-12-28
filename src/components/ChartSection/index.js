import React from 'react';
import Divider from '../Divider';
import StockboardBarChart from '../StockboardBarChart';
import { sortByDate, addPercentageGrowth } from '../../utils'

const ChartSection = ({ label, dataKey, incomeStmtData }) => {
  if (!incomeStmtData || !incomeStmtData.length) {
    return null;
  }

  return (
    <div className="show">
      <Divider label={label} />
      {incomeStmtData.map((data) => {
        const dataList = data.value
          ? data.value.map((annualReportObj) => ({
              date: annualReportObj.fiscalYear,
              value: annualReportObj[dataKey],
            }))
          : [];
        const sortedData = sortByDate(dataList);
        const dataWithPercentage = addPercentageGrowth(sortedData, 5);
        return <StockboardBarChart key={data.tickerName} data={dataWithPercentage} tickerName={data.tickerName} />;
      })}
    </div>
  );
};

export default ChartSection;
