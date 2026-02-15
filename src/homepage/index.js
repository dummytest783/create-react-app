import React from 'react'
import axios from 'axios';
import { Header, Button, Tab, Menu} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'
import './homepage.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MultiSelect from '../components/MultiSelect'
import ChartSection from '../components/ChartSection'
import AIRecommendations from '../components/AIRecommendations'
import IndustryGrowth from '../components/IndustryGrowth'
import UpgradePrompt from '../components/UpgradePrompt'
import appkey from '../config/appkey.json'
import api from '../config/api.json'
import MetricsTable from '../components/MetricsTable'
import Loader from '../components/Loader'
import CashFlowCharts from '../components/CashFlowCharts'
import FinancialStrengthCharts from '../components/FinancialStrengthCharts'
import VideoSection from '../components/VideoSection'
import analytics from '../analytics'


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.valuationList = [
          {key: 'priceToEarningsRatioTTM', label:'PE', better: 'lower', desc: 'Price/Earning', info: 'P/E ratio = Market Price of Stock / Earnings per Share (EPS)'},
          {key: 'priceToEarningsGrowthRatioTTM', label:'PEG', better: 'lower', desc: 'P/E Growth (less than 1 is undervalued)', info: 'PEG ratio = P/E ratio / Expected Earnings Growth Rate.'},
          {key: 'priceToFreeCashFlowRatioTTM', label:'P/FCF', better: 'lower', desc: 'Price to Free Cash Flow', info: 'P/FCF ratio = Market Price / Free Cash Flow per Share'},
          {key: 'freeCashFlowPerShareTTM', label:'FCF/Share', better: 'higher', desc: 'Free Cash Flow per Share', info: 'FCF per Share = Free Cash Flow / Number of Outstanding Shares'},
          {key: 'dividendYieldTTM', label:'DividendYield', better: 'higher', desc: 'Dividend you earn on every 1$', info: 'Dividend Yield = (Annual Dividends per Share / Current Market Price per Share) x 100', multiplier: 100}
        ];
        this.profitList = [
            {key: 'netProfitMarginTTM',label:'NetProfitMargin', better: 'higher', desc: 'Net Profit Margin Last 12 months', info: 'Net Profit Margin = (Net Income / Revenue) x 100', multiplier: 100},
            {key: 'debtServiceCoverageRatioTTM', label:'DebtServiceCoverage', better: 'higher', desc: 'Debt Service Coverage Ratio', info: 'Debt Service Coverage Ratio = Total Cash Produced / Debt Payment (Less than 2 is risky)'}
        ];

        // Check for URL parameter to enable paid features for testing
        const urlParams = new URLSearchParams(window.location.search);
        /* eslint-disable no-unused-vars */
        const isPaidUserParam = urlParams.get('abdullah');

        this.state = {
          inputTicker :'',
          tickerData: [],
          incomeStmtdata: [],
          cashFlowData: [],
          balanceSheetData: [],
          multiSelectInput: [],
          AIRecommendationsData: null,
          aiLoader: false,
          showIndustryGrowth: true,
          isPaidUser:  true, // isPaidUserParam === 'true',
          cashFlowLoaded: false,
          balanceSheetLoaded: false
        };
    }

    handleSelectChange = (selectedValues) =>  {
      this.setState({multiSelectInput: selectedValues})
    };

    resetTabData() {
      // Centralized method to reset all lazy-loaded tab data
      // Add new tab resets here when adding new tabs
      return {
        cashFlowLoaded: false,
        cashFlowData: [],
        balanceSheetLoaded: false,
        balanceSheetData: [],
      }
    }

    getTickerData(inputArray) {
      const apikey = appkey.fmpKey_P;
      const requestTickerPromises = inputArray.map((ticker) => {
        const apiUrl = `${api.fmp}/stable/ratios-ttm?symbol=${ticker}&apikey=${apikey}`;

        // Return the promise along with the ticker identifier
        return axios.get(apiUrl).then((response) => ({
          Symbol: ticker,
          data: response.data && response.data[0],
        }));
      });

      // Resolve all promises and maintain the association with the ticker
      Promise.all(requestTickerPromises)
        .then((values) => {
          // Update state with the data, including the ticker symbol
          this.setState({ tickerData: values });
        })
        .catch((error) => {
          console.error('Error fetching ticker data:', error);
          // Handle errors as needed
        });
    }

    getIncomeStmtData (inputArray) {
      const apikey = appkey.fmpKey_P;
      const requestPromises = [];
      for (const ticker of inputArray) {
        const apiUrl = `${api.fmp}${api.fmpIncomeStatementApi}?symbol=${ticker}&period=annual&apikey=${apikey}&limit=5`;
        requestPromises.push(axios.get(apiUrl))
      }

      Promise.all(requestPromises).then((values) => {
        // Populates the income statement data array with the ticker name and the data being used for both charts net income and revenue.
        const incomeStmtDataArr = values.map(value => {
          const data = value.data && value.data.length ? value.data : []; // Ensure data exists and is not empty
          return {
            tickerName: data.length > 0 ? data[0].symbol : 'N/A', // Check if data[0] exists
            value: data
          };
        });

        this.setState({incomeStmtdata: incomeStmtDataArr})
      });
    }

    getCashFlowData(inputArray) {
      const apikey = appkey.fmpKey_P;
      const requestPromises = [];

      for (const ticker of inputArray) {
        const apiUrl = `${api.fmp}/stable/cash-flow-statement?symbol=${ticker}&apikey=${apikey}&period=annual`;
        requestPromises.push(axios.get(apiUrl));
      }

      Promise.all(requestPromises).then((values) => {
        // Populates the cash flow data array with the ticker name and the data
        const cashFlowDataArr = values.map(value => {
          const data = value.data && value.data.length ? value.data : [];
          return {
            tickerName: data.length > 0 ? data[0].symbol : 'N/A',
            value: data
          };
        });

        this.setState({
          cashFlowData: cashFlowDataArr,
          cashFlowLoaded: true
        });
      }).catch((error) => {
        console.error('Error fetching cash flow data:', error);
        this.setState({ cashFlowLoaded: true });
      });
    }

    getBalanceSheetData(inputArray) {
      const apikey = appkey.fmpKey_P;
      const requestPromises = [];

      for (const ticker of inputArray) {
        const apiUrl = `${api.fmp}/stable/balance-sheet-statement?symbol=${ticker}&apikey=${apikey}&period=annual`;
        requestPromises.push(axios.get(apiUrl));
      }

      Promise.all(requestPromises).then((values) => {
        // Populates the balance sheet data array with the ticker name and the data
        const balanceSheetDataArr = values.map(value => {
          const data = value.data && value.data.length ? value.data : [];
          return {
            tickerName: data.length > 0 ? data[0].symbol : 'N/A',
            value: data
          };
        });

        this.setState({
          balanceSheetData: balanceSheetDataArr,
          balanceSheetLoaded: true
        });
      }).catch((error) => {
        console.error('Error fetching balance sheet data:', error);
        this.setState({ balanceSheetLoaded: true });
      });
    }

    getAIRecommendationsData(inputArray) {
      console.log('state getAIRecommendationsData :', this.state);
      this.setState({ aiLoader: true });
      const tickerQuery = inputArray.join(",");

      // Determine base URL based on environment variable
      const baseUrl = process.env.REACT_APP_USE_LOCAL_API === 'true'
        ? 'http://127.0.0.1:8000'
        : 'https://stockagent.onrender.com';

      // Only use mock data in local development
      const useMockParam = process.env.NODE_ENV === 'development' ? '&use_mock=true' : '';

      fetch(`${baseUrl}/analyze-stocks?tickers=${tickerQuery}${useMockParam}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('AI response data:', data);
          this.setState({
            AIRecommendationsData: data,
            aiLoader: false
          });
        })
        .catch((error) => {
          this.setState({ aiLoader: false });
          console.error("Error fetching data:", error);
        });
    }

    // handleTickerChange (e) {
    //   this.setState({inputTicker: e.target.value})
    // }

    searchClick() {
      this.inputArray = this.state.multiSelectInput.map(tickerObj => tickerObj.value)
      console.log('inputArray:', this.inputArray)
      this.setState({
        'inputTicker': '',
        showIndustryGrowth: false,
        ...this.resetTabData()  // Reset all lazy-loaded tab data
      })
      this.getTickerData(this.inputArray)
      this.getIncomeStmtData(this.inputArray)

      // Only call AI API for paid users
      if (this.state.isPaidUser) {
        this.getAIRecommendationsData(this.inputArray)
      }
    }

    handleLogoClick = () => {
      this.setState({
        showIndustryGrowth: true,
        multiSelectInput: [],
        tickerData: [],
        incomeStmtdata: [],
        AIRecommendationsData: null,
        ...this.resetTabData()  // Reset all lazy-loaded tab data
      });
    }

    handleCompanyClick = (symbol, companyName) => {
      // Set the selected company in the search box
      const selectedCompany = {
        label: `${companyName} (${symbol})`,
        value: symbol
      };

      // Update state and trigger data fetching
      this.setState({
        multiSelectInput: [selectedCompany],
        showIndustryGrowth: false,
        ...this.resetTabData()  // Reset all lazy-loaded tab data
      }, () => {
        // Scroll to top smoothly when switching views
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fetch data for the selected company
        this.getTickerData([symbol]);
        this.getIncomeStmtData([symbol]);

        // Only call AI API for paid users
        if (this.state.isPaidUser) {
          this.getAIRecommendationsData([symbol]);
        }
      });
    }

    renderChartsTab() {
        return (
          <div>
            <div className={this.state.incomeStmtdata && this.state.incomeStmtdata.length ? 'show' : 'hide'}>
              <ChartSection
                  label="Revenue Growth of Last 5 Years"
                  dataKey="revenue"
                  incomeStmtData={this.state.incomeStmtdata}
                  addPercentageGrowth={this.addPercentageGrowth}
                />

            </div>
            <div className={this.state.incomeStmtdata && this.state.incomeStmtdata.length ? 'show' : 'hide'}>
              <ChartSection
                  label="Net Income Growth of Last 5 Years"
                  dataKey="netIncome"
                  incomeStmtData={this.state.incomeStmtdata}
                  addPercentageGrowth={this.addPercentageGrowth}
                />

            </div>
            <VideoSection
              videoId="WeJOrL6cqBM"
              title="Understanding Revenue & Profit Growth"
            />
          </div>
        )
    }

    renderAIRecommendations() {
      console.log('AIRecommendationsData loader:', this.state.AIRecommendationsData, this.state.aiLoader)

      // Show upgrade prompt for non-paid users
      if (!this.state.isPaidUser) {
        return <UpgradePrompt />
      }

      return (
        this.state.aiLoader ? <Loader message="Your AI agent is working...." /> : <AIRecommendations AIRecommendationsData={ this.state.AIRecommendationsData }/>
      )
    }

    renderMetrics() {
      return (
        <MetricsTable valuationList={this.valuationList} profitList={this.profitList} tickerData={this.state.tickerData} />
      );
    }

    renderCashFlow() {
      // Lazy load cash flow data only when tab is accessed
      if (!this.state.cashFlowLoaded && this.state.multiSelectInput.length > 0) {
        const inputArray = this.state.multiSelectInput.map(tickerObj => tickerObj.value);
        this.getCashFlowData(inputArray);
      }

      if (!this.state.cashFlowLoaded) {
        return <Loader message="Loading cash flow data..." />;
      }

      return (
        <div>
          {this.state.cashFlowData.map((cashFlowItem, index) => (
            <div key={index} className={this.state.cashFlowData && this.state.cashFlowData.length ? 'show' : 'hide'}>
              <CashFlowCharts cashFlowData={cashFlowItem.value} tickerName={cashFlowItem.tickerName} />
            </div>
          ))}
          <VideoSection
            videoId="n9WsbmX_VsU"
            title="Why Cash Flow Matters More Than Profits"
          />
        </div>
      );
    }

    renderFinancialStrength() {
      // Lazy load balance sheet data only when tab is accessed
      if (!this.state.balanceSheetLoaded && this.state.multiSelectInput.length > 0) {
        const inputArray = this.state.multiSelectInput.map(tickerObj => tickerObj.value);
        this.getBalanceSheetData(inputArray);
      }

      if (!this.state.balanceSheetLoaded) {
        return <Loader message="Loading balance sheet data..." />;
      }

      return (
        <div>
          {this.state.balanceSheetData.map((balanceSheetItem, index) => (
            <div key={index} className={this.state.balanceSheetData && this.state.balanceSheetData.length ? 'show' : 'hide'}>
              <FinancialStrengthCharts balanceSheetData={balanceSheetItem.value} tickerName={balanceSheetItem.tickerName} />
            </div>
          ))}
        </div>
      );
    }

    handleTabChange = (_e, data) => {
      const { activeIndex } = data;

      // Find which tab was clicked by checking the panes array
      const panes = this.getPanes();
      const clickedPane = panes[activeIndex];

      // Track AI Stock Advisor tab click using the unique key instead of index
      if (clickedPane && clickedPane.key === 'ai-advisor') {
        const tickers = this.state.multiSelectInput.map(item => item.value);
        analytics.trackAIAdvisorClick(tickers, 'tab');
      }
    }

    getPanes() {
      return [
        {
          key: 'growth',
          menuItem: 'Growth',
          render: () => <Tab.Pane className="customTabPane">{this.renderChartsTab()}</Tab.Pane>
        },
        {
          key: 'cashflow',
          menuItem: 'Cash Flow',
          render: () => <Tab.Pane className="customTabPane">{this.renderCashFlow()}</Tab.Pane>
        },
        {
          key: 'financial-strength',
          menuItem: 'Financial Strength',
          render: () => <Tab.Pane className="customTabPane">{this.renderFinancialStrength()}</Tab.Pane>
        },
        {
          key: 'metrics',
          menuItem: 'Metrics',
          render: () => <Tab.Pane className="customTabPane">{this.renderMetrics()}</Tab.Pane>
        },
        {
          key: 'ai-advisor', // Unique identifier for AI tab
          menuItem: (
            <Menu.Item key='ai-recommendation'>
              <div className="tab-with-badge">
                AI Stock Advisor
                <span className="crown-badge">👑</span>
              </div>
            </Menu.Item>
          ),
          render: () => <Tab.Pane className="customTabPane">{this.renderAIRecommendations()}</Tab.Pane>
        },
      ];
    }

    render() {
      const panes = this.getPanes();
      return  (
        <div className='home'>
          <Navbar onLogoClick={this.handleLogoClick} isPaidUser={this.state.isPaidUser} />
          <div className="content">
            <Header as='h1' className='pageHeader'> Search Engine of Investing </Header>
            <div className='searchSection'>
              <MultiSelect setMultiSelectValues={this.handleSelectChange} multiSelectInput={this.state.multiSelectInput}/>
              <Button className="searchbtn" primary onClick={e => this.searchClick()}>Search</Button>
            </div>
            {this.state.showIndustryGrowth && (
              <>
                <VideoSection
                  videoId="v2uxJ3CDLGY"
                  title="Stocklele — Smarter Investing, Made Simple"
                />
                <IndustryGrowth onCompanyClick={this.handleCompanyClick} />
              </>
            )}
            {this.state.tickerData.length > 0 && <Tab panes={panes} onTabChange={this.handleTabChange} />}
          </div>
          <div>
            <Footer />
          </div>
        </div>
      )
    }
}
export default HomePage
