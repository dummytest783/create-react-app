import React from 'react'
import { Header, Table, Input, Button} from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import 'semantic-ui-css/semantic.min.css'
import './homepage.css'
import Divider from '../components/Divider'
import StockboardBarChart from '../components/StockboardBarChart'
import axios from 'axios';
import appkey from '../config/appkey.json'
import { sortByDate } from '../utils'


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.valuationList = [
          {key: 'PERatio', better: 'lower', desc: 'Price/Earning'},
          {key: 'PEGRatio', better: 'lower', desc: 'P/E Growth (less than 1 is undervalued)'},
          {key: 'EPS', better: 'higher', desc: 'Earning per share'},
          {key: 'DividendYield', better: 'higher', desc: 'Dividend you earn on every 1$'}
        ];
        this.profitList = [
            {key: 'ProfitMargin', better: 'higher', desc: 'Profit Margin'},
            {key: 'ReturnOnAssetsTTM', better: 'higher', desc: 'Return on Asset Last 12 months'},
            {key: 'ReturnOnEquityTTM', better: 'higher', desc: 'Return on Equity Last 12 months'}
        ];

        this.state = {
          inputTicker :'',
          tickerData: [],
          incomeStmtdata: []
        };
    }

    isValueGood(item, value) {
       const allNumbers = this.state.tickerData.map(stock => parseFloat(stock[item.key]))
       if(item.better === 'lower') {
          return Math.min(...allNumbers) === parseFloat(value)
       } else if (item.better === 'higher') {
          return Math.max(...allNumbers) === parseFloat(value)
       } else if(item.better === 'lessThan1') {
          return parseFloat(value) < 1
       }
       return false;
    }

    getTickerData (inputArray) {
      const apikey = appkey.alphaVintageKey;
      const requestTickerPromises = [];
      for (const ticker of inputArray) {
        const apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apikey}`;
        requestTickerPromises.push(axios.get(apiUrl))
      }

      Promise.all(requestTickerPromises).then((values) => {
        console.log('ticker data', values);
        this.setState({tickerData: values.map(value => value.data)})
      });
    }

    getIncomeStmtData (inputArray) {
      console.log('income data ', inputArray)
      const apikey = appkey.graphAlphaVintageKey;
      const requestPromises = [];
      for (const ticker of inputArray) {
        const apiUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${apikey}`;
        requestPromises.push(axios.get(apiUrl))
      }

      Promise.all(requestPromises).then((values) => {
        console.log('income stmt', values);
        const incomeStmtDataArr = values.map(value => {
          return {tickerName: value.data.symbol, value: value.data}
        })
        this.setState({incomeStmtdata: incomeStmtDataArr})
      });
    }

    handleTickerChange (e) {
      this.setState({inputTicker: e.target.value})
    }

    searchClick() {
      const tickerStr = this.state.inputTicker.replace(/\s+/g, "");
      const inputArray = tickerStr.split(',');
      console.log(inputArray)
      this.setState({'inputTicker': ''})
      this.getTickerData(inputArray)
      this.getIncomeStmtData(inputArray)

    }

    render() {
      return  (
        <div> 
          <div className="dbdata">
            <Header as='h1' className='pageHeader'> Which Stock to Buy? </Header>
            <Input placeholder='Enter coma seperated ticker' className='tickerInput' value={this.state.inputTicker} onChange={e => this.handleTickerChange(e)} />
            <Button className="searchbtn" primary onClick={e => this.searchClick()}>Search</Button>
            <div>
              <Table unstackable className="table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Technical Indicator</Table.HeaderCell>
                    {
                      this.state.tickerData && this.state.tickerData.map((item, index) => {
                        return (<Table.HeaderCell key={index}> {item.Symbol} </Table.HeaderCell>)
                      })
                    }
                  </Table.Row>
                </Table.Header>
            
                <Table.Body>
                  <Table.Row fullWidth className='sectionHeader'> <Table.Cell colSpan={(this.state.tickerData.length + 1) + ""}>Valuation <FontAwesomeIcon icon={faArrowTrendUp} size={12} /> </Table.Cell>  
                  </Table.Row>
                    {
                        this.valuationList && this.valuationList.map((item, index) => {
                          return (<Table.Row key={index}>
                              <Table.Cell> {item.key}  <span className='desc'> {item.desc}</span></Table.Cell>
                              {
                                this.state.tickerData && this.state.tickerData.map((tickerDataObj, index) => {
                                  return (<Table.Cell className = {this.isValueGood(item, tickerDataObj[item.key]) && 'upcolor' } > {tickerDataObj[item.key]} </Table.Cell>)
                                })
                              }
                          </Table.Row>)
                          
                        })
                        
                    }
                     <Table.Row fullWidth className='sectionHeader'><Table.Cell  colSpan={(this.state.tickerData.length + 1) + ""}>Profitability <FontAwesomeIcon icon={faSackDollar} size={12} /> </Table.Cell> </Table.Row>

                     {
                        this.profitList && this.profitList.map((item, index) => {
                          return (<Table.Row key={index}>
                              <Table.Cell> {item.key} <span className='desc'> {item.desc}</span> </Table.Cell>
                              {
                                this.state.tickerData && this.state.tickerData.map((tickerDataObj, index) => {
                                  return (<Table.Cell className = {this.isValueGood(item, tickerDataObj[item.key]) && 'upcolor' }  > {tickerDataObj[item.key]} </Table.Cell>)
                                })
                              }
                          </Table.Row>)
                          
                        })
                        
                    }

                </Table.Body>
              </Table>
            </div>
            <div className={this.state.incomeStmtdata && this.state.incomeStmtdata.length ? 'show' : 'hide'}>
              <Divider label="Net Income Growth of Last 5 Years"/>
              {
                this.state.incomeStmtdata && this.state.incomeStmtdata.map((data) => {
                  console.log('data....', data.value.annualReports)
                  const charObj = sortByDate(data.value.annualReports.map((annualReportObj) => { return {'date': new Date(annualReportObj.fiscalDateEnding).getFullYear(), 'value': annualReportObj.netIncome} }));
                  return (<StockboardBarChart data={charObj} tickerName={data.tickerName} />)
                })
              }
                    
            </div>
            <div className={this.state.incomeStmtdata && this.state.incomeStmtdata.length ? 'show' : 'hide'}>
              <Divider label="Revenue Growth of Last 5 Years"/>
              {
                this.state.incomeStmtdata && this.state.incomeStmtdata.map((data) => {
                  console.log('data....', data.value.annualReports)
                  const charObj = sortByDate(data.value.annualReports.map((annualReportObj) => { return {'date': new Date(annualReportObj.fiscalDateEnding).getFullYear(), 'value': annualReportObj.totalRevenue} }));
                  return (<StockboardBarChart data={charObj} tickerName={data.tickerName} />)
                })
              }
                    
            </div>
            </div>
          </div>
      )
    }
}
export default HomePage
