import './App.css';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from "./homepage";
import AIStockAdvisorPage from "./pages/AIStockAdvisorPage";
import Chatbot from "./components/Chatbot";
import analytics from './analytics';

// Track page views on route changes
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView(location.pathname);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    // Initialize analytics once when app loads
    analytics.initialize();
  }, []);

  return (
    <Router>
      <div className="App">
        <AnalyticsTracker />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/ai-stock-advisor" component={AIStockAdvisorPage} />
        </Switch>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
