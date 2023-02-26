import React from 'react'
import { Header, Table, Input, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './DbHostApp.css'
import axios from 'axios';


class DbHostApp extends React.Component {
    constructor(props) {
        super(props);
        this.valuationList = [
          {key: 'PERatio', better: 'lower'},
          {key: 'PEGRatio', better: 'lower', desc: 'less than 1 is undervalued company'},
          {key: 'EPS', better: 'higher'},
          {key: 'DividendYield', better: 'higher'}
        ];
        this.profitList = [
            {key: 'ProfitMargin', better: 'higher'},
            {key: 'ReturnOnAssetsTTM', better: 'higher'},
            {key: 'ReturnOnEquityTTM', better: 'higher'}
        ];

        this.state = {
          inputTicker :'',
          result: []
        };
    }

    isValueGood(item, value) {
       const allNumbers = this.state.result.map(stock => parseFloat(stock[item.key]))
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
      const apikey = 'OKK7K4SBZYR5UV7N';
      const requestPromises = [];
      for (const ticker of inputArray) {
        const apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apikey}`;
        requestPromises.push(axios.get(apiUrl))
      }

      Promise.all(requestPromises).then((values) => {
        console.log(values);
        this.setState({result: values.map(value => value.data)})
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

    }

    render() {
      return  (
        <div> 
          <div className="dbdata">
            <Header as='h1'> Which Stock to Buy? </Header>
            <Input placeholder='Enter coma seperated ticker' className='tickerInput' value={this.state.inputTicker} onChange={e => this.handleTickerChange(e)} />
            <Button className="searchbtn" primary onClick={e => this.searchClick()}>Search</Button>
            <div>
              <Table unstackable className="table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Technical Indicator</Table.HeaderCell>
                    {
                      this.state.result && this.state.result.map((item, index) => {
                        return (<Table.HeaderCell key={index}> {item.Symbol}</Table.HeaderCell>)
                      })
                    }
                  </Table.Row>
                </Table.Header>
            
                <Table.Body>
                  <Table.Row fullWidth className='sectionHeader'> Valuation </Table.Row>
                    {
                        this.valuationList && this.valuationList.map((item, index) => {
                          return (<Table.Row key={index}>
                              <Table.Cell> {item.key} </Table.Cell>
                              {
                                this.state.result && this.state.result.map((tickerDataObj, index) => {
                                  return (<Table.Cell className = {this.isValueGood(item, tickerDataObj[item.key]) && 'upcolor' } > {tickerDataObj[item.key]} </Table.Cell>)
                                })
                              }
                          </Table.Row>)
                          
                        })
                        
                    }
                     <Table.Row fullWidth className='sectionHeader'> Profitability </Table.Row>

                     {
                        this.profitList && this.profitList.map((item, index) => {
                          return (<Table.Row key={index}>
                              <Table.Cell> {item.key} </Table.Cell>
                              {
                                this.state.result && this.state.result.map((tickerDataObj, index) => {
                                  return (<Table.Cell className = {this.isValueGood(item, tickerDataObj[item.key]) && 'upcolor' }  > {tickerDataObj[item.key]} </Table.Cell>)
                                })
                              }
                          </Table.Row>)
                          
                        })
                        
                    }

                </Table.Body>
              </Table>
            </div>
            </div>
          </div>
      )
    }
}
export default DbHostApp
