import React, { Component } from 'react';
import { Container, Segment, Header, Icon } from 'semantic-ui-react';
import Navbar from '../components/Navbar';
import MultiSelect from '../components/MultiSelect';
import AIRecommendations from '../components/AIRecommendations';
import UpgradePrompt from '../components/UpgradePrompt';
import api from '../config/api.json';
import axios from 'axios';
import './AIStockAdvisorPage.css';

class AIStockAdvisorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTickers: [],
      AIRecommendationsData: null,
      loading: false,
      error: null
    };
  }

  handleTickersChange = (selectedTickers) => {
    this.setState({ selectedTickers });

    // Only fetch AI recommendations if exactly one ticker is selected
    if (selectedTickers && selectedTickers.length === 1) {
      this.fetchAIRecommendations(selectedTickers[0].value);
    } else {
      this.setState({ AIRecommendationsData: null });
    }
  };

  fetchAIRecommendations = async (ticker) => {
    this.setState({ loading: true, error: null });

    const apiUrl = `${api.backend}/ai-recommendations?ticker=${ticker}`;

    try {
      const response = await axios.get(apiUrl);
      console.log('AI Recommendations Response:', response.data);

      this.setState({
        AIRecommendationsData: response.data,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      this.setState({
        error: 'Failed to fetch AI recommendations. Please try again.',
        loading: false,
        AIRecommendationsData: null
      });
    }
  };

  handleLogoClick = () => {
    this.props.history.push('/');
  };

  render() {
    const { selectedTickers, AIRecommendationsData, loading, error } = this.state;

    return (
      <div className="ai-stock-advisor-page">
        <Navbar onLogoClick={this.handleLogoClick} isPaidUser={false} />

        <Container className="ai-advisor-container">
          {/* Show UpgradePrompt when no stock is selected */}
          {selectedTickers.length === 0 && (
            <UpgradePrompt />
          )}

          {/* Show search and results when user interacts */}
          {selectedTickers.length > 0 && (
            <>
              <div className="page-header">
                <Header as="h1" className="page-title">
                  <span className="title-icon">👑</span>
                  AI Stock Advisor
                  <Header.Subheader>
                    Get intelligent investment recommendations powered by AI
                  </Header.Subheader>
                </Header>
              </div>

              <Segment className="search-section">
                <Header as="h3">
                  <Icon name="search" />
                  Selected Stock
                </Header>
                <MultiSelect
                  className="stock-selector"
                  handleChange={this.handleTickersChange}
                  selectedOptions={selectedTickers}
                  placeholder="Search for a stock ticker..."
                />
              </Segment>

              {selectedTickers.length > 1 && (
                <Segment placeholder textAlign="center" className="warning-state">
                  <Header icon>
                    <Icon name="warning sign" />
                    Please select only one stock at a time for AI recommendations
                  </Header>
                </Segment>
              )}

              {loading && (
                <Segment placeholder textAlign="center" className="loading-state">
                  <Header icon>
                    <Icon name="spinner" loading />
                    Analyzing stock data...
                  </Header>
                </Segment>
              )}

              {error && (
                <Segment placeholder textAlign="center" className="error-state">
                  <Header icon>
                    <Icon name="exclamation triangle" color="red" />
                    {error}
                  </Header>
                </Segment>
              )}

              {selectedTickers.length === 1 && !loading && AIRecommendationsData && (
                <div className="recommendations-section">
                  <AIRecommendations AIRecommendationsData={AIRecommendationsData} />
                </div>
              )}
            </>
          )}

        </Container>
      </div>
    );
  }
}

export default AIStockAdvisorPage;
