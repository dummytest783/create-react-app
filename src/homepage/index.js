import React from 'react'
import axios from 'axios';
import { Header, Button, Tab} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'
import './homepage.css'
import Footer from '../components/Footer'
import MultiSelect from '../components/MultiSelect'
import ChartSection from '../components/ChartSection'
import AIRecommendations from '../components/AIRecommendations'
import appkey from '../config/appkey.json'
import api from '../config/api.json'
import MetricsTable from '../components/MetricsTable'
import Loader from '../components/Loader'


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

        this.state = {
          inputTicker :'',
          tickerData: [],
          incomeStmtdata: [],
          multiSelectInput: [],
          AIRecommendationsData: null,
          aiLoader: false
        };
    }

    handleSelectChange = (selectedValues) =>  {
      this.setState({multiSelectInput: selectedValues})
    };

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

    getAIRecommendationsData(inputArray) {
      console.log('state getAIRecommendationsData :', this.state);
      this.setState({ aiLoader: true });
      const tickerQuery = inputArray.join(",");
      
      // Determine base URL based on environment variable
      const baseUrl = process.env.REACT_APP_USE_LOCAL_API === 'true'
        ? 'http://127.0.0.1:8000'
        : 'https://stockagent.onrender.com';
      
      fetch(`${baseUrl}/analyze-stocks?tickers=${tickerQuery}`)
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
      this.setState({'inputTicker': ''})
      this.getTickerData(this.inputArray)
      this.getIncomeStmtData(this.inputArray)
      this.getAIRecommendationsData(this.inputArray)

    }

    renderChartsTab() {
        return (
          <div>
            <div className={this.state.incomeStmtdata && this.state.incomeStmtdata.length ? 'show' : 'hide'}>
              <ChartSection
                  label="Net Income Growth of Last 5 Years"
                  dataKey="netIncome"
                  incomeStmtData={this.state.incomeStmtdata}
                  addPercentageGrowth={this.addPercentageGrowth}
                />
                    
            </div>
            <div className={this.state.incomeStmtdata && this.state.incomeStmtdata.length ? 'show' : 'hide'}>
              <ChartSection
                  label="Revenue Growth of Last 5 Years"
                  dataKey="revenue"
                  incomeStmtData={this.state.incomeStmtdata}
                  addPercentageGrowth={this.addPercentageGrowth}
                />
                    
            </div>
          </div>
        )
    }

    renderAIRecommendations() {
      console.log('AIRecommendationsData loader:', this.state.AIRecommendationsData, this.state.aiLoader)
      return (
        this.state.aiLoader ? <Loader message="Your AI agent is working...." /> : <AIRecommendations AIRecommendationsData={ this.state.AIRecommendationsData }/>
      )
    }

    renderMetrics() {
      return (
        <MetricsTable valuationList={this.valuationList} profitList={this.profitList} tickerData={this.state.tickerData} />
      );
    }

    render() {
      const panes = [
        { menuItem: 'Charts', render: () => <Tab.Pane className="customTabPane">{this.renderChartsTab()}</Tab.Pane> },
        { menuItem: 'AI Recommendation', render: () => <Tab.Pane className="customTabPane">{this.renderAIRecommendations()}</Tab.Pane> },
        { menuItem: 'Metrics', render: () => <Tab.Pane className="customTabPane">{this.renderMetrics()}</Tab.Pane> },
      ];
      return  (
        <div className='home'> 
          <div className="header">
            <nav class="navbar">
              <div class="logo">
                <img src="logo.png" alt="Logo" />
              </div>
              <ul class="nav-links">
                <li><a href="#home"></a></li>
              </ul>
            </nav>
          </div>
          <div className="content">
            <Header as='h1' className='pageHeader'> Search Engine of Investing </Header>
            <div className='searchSection'>
              <MultiSelect setMultiSelectValues={this.handleSelectChange} multiSelectInput={this.state.multiSelectInput}/>
              <Button className="searchbtn" primary onClick={e => this.searchClick()}>Search</Button>
            </div>
            {this.state.tickerData.length > 0 && <Tab panes={panes} />}
          </div>
          <div>
            <Footer />
          </div> 
        </div>
      )
    }
}
export default HomePage
