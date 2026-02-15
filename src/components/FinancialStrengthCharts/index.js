import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import StockboardBarChart from '../StockboardBarChart';
import { addPercentageGrowth } from '../../utils';
import './index.css';

const FinancialStrengthCharts = ({ balanceSheetData, tickerName }) => {
  if (!balanceSheetData || balanceSheetData.length === 0) {
    return (
      <Segment placeholder textAlign="center" className="financial-strength-empty-state">
        <Header icon>
          No balance sheet data available
        </Header>
      </Segment>
    );
  }

  // Transform data for Net Debt chart
  const netDebtDataRaw = balanceSheetData.map(item => ({
    date: item.fiscalYear || item.date,
    value: item.netDebt,
    label: 'Net Debt'
  })).reverse(); // Reverse to show oldest to newest
  const netDebtData = addPercentageGrowth(netDebtDataRaw, netDebtDataRaw.length);

  // Transform data for Cash and Short Term Investments chart
  const cashDataRaw = balanceSheetData.map(item => ({
    date: item.fiscalYear || item.date,
    value: item.cashAndShortTermInvestments,
    label: 'Cash & Short Term Investments'
  })).reverse();
  const cashData = addPercentageGrowth(cashDataRaw, cashDataRaw.length);

  return (
    <div className="financial-strength-charts-container">
      <Header as="h2" className="financial-strength-header">
        Financial Strength Analysis
        <Header.Subheader>
          Year-over-year comparison of balance sheet strength indicators
        </Header.Subheader>
      </Header>

      <Grid stackable columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Segment className="chart-segment">
              <Header as="h3" className="chart-title">
                Cash and Short Term Investments
                <Header.Subheader>
                  Liquid assets available for operations and opportunities
                </Header.Subheader>
              </Header>
              <StockboardBarChart
                data={cashData}
                tickerName={tickerName}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment className="chart-segment">
              <Header as="h3" className="chart-title">
                Net Debt
                <Header.Subheader>
                  Total debt minus cash and cash equivalents (lower is better)
                </Header.Subheader>
              </Header>
              <StockboardBarChart
                data={netDebtData}
                tickerName={tickerName}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default FinancialStrengthCharts;
