import React from 'react'
import { Header, Table, Input, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './DbHostApp.css'
import dbData from './hostdata.json';
import axios from 'axios';


class DbHostApp extends React.Component {
    constructor(props) {
        super(props);
        this.valuationList = [
          'PERatio',
          'PEGRatio',
          'EPS',
          'DividendYield'
        ];
        this.profitList = [
            'ProfitMargin',
            'ReturnOnAssetsTTM',
            'ReturnOnEquityTTM'
        ];

        this.state = {
          inputTicker :'',
          result: []
        };
    }

    getTickerData (inputArray) {
      const apikey = 'OKK7K4SBZYR5UV7N';
      
      // const apiUrl = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apikey}`;
      // axios.get(apiUrl)
      //   .then(response => {
      //     console.log('micro', response.data);
      //   })
      //   .catch(error => {
      //     console.log(error);
      // });
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
      this.getTickerData(inputArray)

    }

    render() {
      return  (
        <div> 
          <div className="dbdata">
            <Header as='h1'> Stock Dashboard</Header>
            <Input placeholder='Enter coma seperated ticker' className='tickerInput' value={this.state.inputTicker} onChange={e => this.handleTickerChange(e)} />
            <Button primary onClick={e => this.searchClick()}>Search</Button>
            <div className="dbtable" >
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Indicator</Table.HeaderCell>
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
                              <Table.Cell> {item} </Table.Cell>
                              {
                                this.state.result && this.state.result.map((tickerDataObj, index) => {
                                  return (<Table.Cell className = {item.status === 0 ? 'upcolor' : 'downcolor' } > {tickerDataObj[item]} </Table.Cell>)
                                })
                              }
                          </Table.Row>)
                          
                        })
                        
                    }
                     <Table.Row fullWidth className='sectionHeader'> Profitability </Table.Row>

                     {
                        this.profitList && this.profitList.map((item, index) => {
                          return (<Table.Row key={index}>
                              <Table.Cell> {item} </Table.Cell>
                              {
                                this.state.result && this.state.result.map((tickerDataObj, index) => {
                                  return (<Table.Cell className = {item.status === 0 ? 'upcolor' : 'downcolor' } > {tickerDataObj[item]} </Table.Cell>)
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
