import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import StockboardBarChart from '../StockboardBarChart';
import { addPercentageGrowth } from '../../utils';
import './index.css';

const CashFlowCharts = ({ cashFlowData }) => {
  if (!cashFlowData || cashFlowData.length === 0) {
    return (
      <Segment placeholder textAlign="center" className="cash-flow-empty-state">
        <Header icon>
          No cash flow data available
        </Header>
      </Segment>
    );
  }

  // Transform data for Free Cash Flow chart
  const freeCashFlowDataRaw = cashFlowData.map(item => ({
    date: item.fiscalYear || item.date,
    value: item.freeCashFlow,
    label: 'Free Cash Flow'
  })).reverse(); // Reverse to show oldest to newest
  const freeCashFlowData = addPercentageGrowth(freeCashFlowDataRaw, freeCashFlowDataRaw.length);

  // Transform data for Operating Cash Flow chart
  const operatingCashFlowDataRaw = cashFlowData.map(item => ({
    date: item.fiscalYear || item.date,
    value: item.operatingCashFlow,
    label: 'Operating Cash Flow'
  })).reverse();
  const operatingCashFlowData = addPercentageGrowth(operatingCashFlowDataRaw, operatingCashFlowDataRaw.length);

  // Transform data for Net Income chart
  const netIncomeDataRaw = cashFlowData.map(item => ({
    date: item.fiscalYear || item.date,
    value: item.netIncome,
    label: 'Net Income'
  })).reverse();
  const netIncomeData = addPercentageGrowth(netIncomeDataRaw, netIncomeDataRaw.length);

  return (
    <div className="cash-flow-charts-container">
      <Header as="h2" className="cash-flow-header">
        Cash Flow Analysis
        <Header.Subheader>
          Year-over-year comparison of key financial metrics
        </Header.Subheader>
      </Header>

      <Grid stackable columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Segment className="chart-segment">
              <Header as="h3" className="chart-title">
                Operating Cash Flow
                <Header.Subheader>
                  Cash generated from normal business operations
                </Header.Subheader>
              </Header>
              <StockboardBarChart
                data={operatingCashFlowData}
                tickerName=""
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment className="chart-segment">
              <Header as="h3" className="chart-title">
                Free Cash Flow
                <Header.Subheader>
                  Operating cash flow minus capital expenditures
                </Header.Subheader>
              </Header>
              <StockboardBarChart
                data={freeCashFlowData}
                tickerName=""
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment className="chart-segment">
              <Header as="h3" className="chart-title">
                Net Income
                <Header.Subheader>
                  Total profit after all expenses and taxes
                </Header.Subheader>
              </Header>
              <StockboardBarChart
                data={netIncomeData}
                tickerName=""
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default CashFlowCharts;
