import React, { useMemo } from 'react';
import { Table, Popup } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faSackDollar, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { roundToTwoDecimals } from '../../utils/index';
import './index.scss';

const MetricsTable = ({ valuationList, profitList, tickerData }) => {
  
  // Function to check if the value is good
  const isValueGood = (item, value) => {
    const allNumbers = tickerData.map((stock) => {
      const rawValue = stock.data && parseFloat(stock.data[item.key]);
      return item.multiplier ? rawValue * item.multiplier : rawValue;
    });
    if (item.better === 'lower') {
      return Math.min(...allNumbers) === parseFloat(value);
    } else if (item.better === 'higher') {
      return Math.max(...allNumbers) === parseFloat(value);
    } else if (item.better === 'lessThan1') {
      return parseFloat(value) < 1;
    }
    return false;
  };

  // Memoize the table content to prevent unnecessary re-renders.
  const tableContent = useMemo(() => (
    <Table.Body>
      <Table.Row fullWidth className="sectionHeader">
        <Table.Cell colSpan={tickerData.length + 1}>Valuation <FontAwesomeIcon icon={faArrowTrendUp} size={12} /></Table.Cell>
      </Table.Row>
      {valuationList.map((item, index) => (
        <Table.Row key={index}>
          <Table.Cell>{item.label} <span className="desc">{item.desc}</span>
            <Popup trigger={<FontAwesomeIcon icon={faInfoCircle} size={12} />} content={item.info} className="infoIcon" position="top center" />
          </Table.Cell>
          {tickerData.map((data, idx) => {
            const rawValue = data.data[item.key];
            const displayValue = item.multiplier ? rawValue * item.multiplier : rawValue;
            const formattedValue = displayValue === 'N/A' ? 'N/A' : roundToTwoDecimals(displayValue);
            const finalDisplay = item.multiplier && formattedValue !== 'N/A' ? `${formattedValue}%` : formattedValue;
            return (
              <Table.Cell key={idx} className={isValueGood(item, displayValue) ? 'upcolor' : ''}>
                {finalDisplay}
              </Table.Cell>
            );
          })}
        </Table.Row>
      ))}
      <Table.Row fullWidth className="sectionHeader">
        <Table.Cell colSpan={tickerData.length + 1}>Profitability <FontAwesomeIcon icon={faSackDollar} size={12} /></Table.Cell>
      </Table.Row>
      {profitList.map((item, index) => (
        <Table.Row key={index}>
          <Table.Cell>{item.label} <span className="desc">{item.desc}</span>
            <Popup trigger={<FontAwesomeIcon icon={faInfoCircle} size={12} />} content={item.info} className="infoIcon" position="top center" />
          </Table.Cell>
          {tickerData.map((data, idx) => {
            const rawValue = data.data[item.key];
            const displayValue = item.multiplier ? rawValue * item.multiplier : rawValue;
            const formattedValue = displayValue === 'N/A' ? 'N/A' : roundToTwoDecimals(displayValue);
            const finalDisplay = item.multiplier && formattedValue !== 'N/A' ? `${formattedValue}%` : formattedValue;
            return (
              <Table.Cell key={idx} className={isValueGood(item, displayValue) ? 'upcolor' : ''}>
                {finalDisplay}
              </Table.Cell>
            );
          })}
        </Table.Row>
      ))}
    </Table.Body>
  ), [valuationList, profitList, tickerData]);

  return (
    <div className={`${tickerData.length ? 'show' : 'hide'} metricsTable`}>
      <Table unstackable className="table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Technical Indicator</Table.HeaderCell>
            {tickerData.map((item, index) => (
              <Table.HeaderCell key={index}>{item.Symbol}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        {tableContent}
      </Table>
    </div>
  );
};

export default MetricsTable;
