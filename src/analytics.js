import ReactGA from 'react-ga4';

class Analytics {
  constructor() {
    this.initialized = false;
  }

  // Initialize Google Analytics
  initialize() {
    const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;

    if (measurementId) {
      ReactGA.initialize(measurementId);
      this.initialized = true;
      console.log('Analytics initialized');
    } else {
      console.warn('GA_MEASUREMENT_ID not found. Analytics disabled.');
    }
  }

  // Track page views (daily visitors)
  pageView(path) {
    if (!this.initialized) return;

    ReactGA.send({
      hitType: 'pageview',
      page: path
    });
  }

  // Track stock searches
  trackStockSearch(ticker, companyName) {
    if (!this.initialized) return;

    ReactGA.event({
      category: 'Stock Search',
      action: 'Stock Selected',
      label: `${ticker} - ${companyName}`,
      ticker: ticker,
      company_name: companyName
    });
  }

  // Track AI Stock Advisor clicks
  trackAIAdvisorClick(tickers, source = 'tab') {
    if (!this.initialized) return;

    const tickerList = Array.isArray(tickers) ? tickers.join(', ') : tickers;
    const displayLabel = tickerList || 'No stocks selected';

    ReactGA.event({
      category: 'AI Features',
      action: 'AI Stock Advisor Clicked',
      label: `${source}: ${displayLabel}`,
      source: source, // 'navbar' or 'tab'
      ticker_count: Array.isArray(tickers) ? tickers.length : 0,
      tickers: tickerList
    });
  }
}

export default new Analytics();
