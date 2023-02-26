import React from 'react'
import { Header, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './DbHostApp.css'
import dbData from './hostdata.json';
import axios from 'axios';


class DbHostApp extends React.Component {
    constructor(props) {
        super(props);
        console.log(dbData);
        this.state = {

        };
    }
    componentDidMount() {
      const symbol = 'MSFT';
      const apikey = 'OKK7K4SBZYR5UV7N';
      
      const apiUrl = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apikey}`;
      axios.get(apiUrl)
        .then(response => {
          console.log('micro', response.data);
        })
        .catch(error => {
          console.log(error);
      });
      
    }
    render() {
      return  (
        <div> 
          <div className="dbdata">
            <Header as='h1'> DB Status Dashboard</Header>
            <div className="dbtable">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Host Name</Table.HeaderCell>
                    <Table.HeaderCell> Status</Table.HeaderCell>
                    <Table.HeaderCell> Primary </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
            
                <Table.Body>
                    {
                        dbData.hosts && dbData.hosts.map((item) => {
                          return (<Table.Row key={item.hostname}>
                              <Table.Cell> {item.hostname} </Table.Cell>
                              <Table.Cell className = {item.status === 0 ? 'upcolor' : 'downcolor' } > {item.status === 0 ? 'Up' : 'Down' } </Table.Cell>
                              <Table.Cell> {item.primary} </Table.Cell>
                          </Table.Row>)
                        })
                    }

                </Table.Body>
              </Table>
            </div>
            <div className="updatetime"> Last updated timestamp : {dbData.lastUpdated} </div>
            </div>
            <footer class="footer"> </footer>
          </div>
      )
    }
}
export default DbHostApp
