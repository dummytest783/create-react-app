import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from "./homepage";
import AIStockAdvisorPage from "./pages/AIStockAdvisorPage";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <div className="App">
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
