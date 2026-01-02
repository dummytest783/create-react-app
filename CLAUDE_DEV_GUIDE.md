# Stocklele Development Guide for Claude

> **Last Updated:** December 24, 2025
> **Purpose:** Comprehensive reference for AI-assisted development of the Stocklele stock analysis application

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Key Technologies](#key-technologies)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Component Reference](#component-reference)
8. [Development Workflow](#development-workflow)
9. [Build & Deployment](#build--deployment)
10. [Code Conventions](#code-conventions)
11. [Known Issues & Technical Debt](#known-issues--technical-debt)
12. [Common Development Tasks](#common-development-tasks)

---

## Project Overview

**Stocklele** is a web application that helps investors make informed decisions using Warren Buffett's value investing principles.

### Core Features
- Multi-stock search and comparison
- Financial metrics analysis (P/E, ROE, debt ratios, etc.)
- 5-year revenue and net income growth visualization
- AI-powered stock recommendations and analysis
- Responsive design for mobile and desktop

### Live Deployment
- **URL:** https://stocklele.best
- **Platform:** Vercel
- **Environment:** Production

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend (CRA)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         HomePage (Main Container)                │  │
│  │  - State Management                              │  │
│  │  - API Orchestration                             │  │
│  │  - Component Coordination                        │  │
│  └──────────────────────────────────────────────────┘  │
│           │             │              │                │
│    ┌──────▼──────┐ ┌───▼────┐ ┌──────▼──────┐        │
│    │ MultiSelect │ │ Charts │ │ AI Analysis │        │
│    └─────────────┘ └────────┘ └─────────────┘        │
└─────────────────────────────────────────────────────────┘
              │                      │
              ▼                      ▼
    ┌──────────────────┐   ┌──────────────────┐
    │  FMP API         │   │  AI Backend      │
    │  (Financial Data)│   │  (Recommendations)│
    └──────────────────┘   └──────────────────┘
```

### Design Pattern
- **Architecture:** Component-based, single-container pattern
- **State:** Local component state (no Redux/Context)
- **Data Flow:** Unidirectional (parent to children via props)
- **Rendering:** Conditional based on data availability

---

## Directory Structure

```
/Users/ababbasi/Experiments/stocklele/create-react-app/
├── public/
│   ├── index.html              # Entry HTML with SEO meta tags
│   ├── manifest.json           # PWA configuration
│   ├── robots.txt              # Search engine crawler rules
│   └── assets/                 # Static images
│
├── src/
│   ├── index.js                # React entry point
│   ├── App.js                  # Root component (minimal wrapper)
│   ├── vitals.js               # Vercel analytics integration
│   │
│   ├── homepage/
│   │   ├── index.js            # Main application logic (202 lines)
│   │   ├── backup-homepage.js  # Backup file (technical debt)
│   │   └── index.css           # Homepage styles
│   │
│   ├── components/
│   │   ├── AIRecommendations/  # AI analysis display (160 lines)
│   │   ├── ChartSection/       # Chart wrapper with data processing
│   │   ├── CustomTooltip/      # Chart tooltip component
│   │   ├── Divider/            # Visual separator
│   │   ├── Footer/             # Page footer
│   │   ├── Loader/             # Loading spinner
│   │   ├── MetricsTable/       # Financial metrics table (76 lines)
│   │   ├── MultiSelect/        # Stock search dropdown (74 lines)
│   │   └── StockboardBarChart/ # Individual chart component
│   │
│   ├── config/
│   │   ├── api.json            # API endpoint URLs
│   │   └── appkey.json         # ⚠️ API keys (should be .env)
│   │
│   ├── utils/
│   │   └── index.js            # Shared utility functions
│   │
│   └── assets/                 # Images and media
│
├── .env.production             # Production environment variables
├── package.json                # Dependencies and scripts
└── CLAUDE_DEV_GUIDE.md         # This file
```

---

## Key Technologies

### Core Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| React Router DOM | 5.1.1 | Client-side routing |
| Create React App | 5.0.1 | Build tooling |
| Node.js/npm | - | Package management |

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| Semantic UI React | 2.1.4 | Primary UI component library |
| SASS | 1.83.1 | CSS preprocessing |
| FontAwesome | 6.3.0 | Icon library |
| Custom CSS | - | Component-specific styling |

### Data & Visualization
| Technology | Version | Purpose |
|------------|---------|---------|
| Recharts | 2.4.3 | Financial charts |
| react-window | 1.8.8 | List virtualization |
| Axios | 1.3.4 | HTTP client for FMP API |
| react-select | 5.7.0 | Advanced dropdown with async search |

### External Services
- **Financial Modeling Prep (FMP) API** - Stock financial data
- **Custom AI Backend** - Stock analysis and recommendations
  - Production: `https://stockagent.onrender.com`
  - Local: `http://127.0.0.1:8000`

---

## State Management

### State Structure (HomePage Component)

```javascript
state = {
  inputTicker: '',              // User input (currently unused)
  tickerData: [],               // Financial ratios data from FMP API
  incomeStmtdata: [],          // 5-year income statement data
  multiSelectInput: [],        // Selected stock tickers
  AIRecommendationsData: null, // AI analysis response
  aiLoader: false              // AI loading state
}
```

### State Update Flow

1. **Stock Selection:**
   ```
   User interacts with MultiSelect
   → handleMultiSelectInputChange()
   → setState({ multiSelectInput: [...] })
   ```

2. **Data Fetching (on Search button click):**
   ```
   handleSubmit()
   → Promise.all([
       getTickerData()     → setState({ tickerData })
       getIncomeStmtData() → setState({ incomeStmtdata })
     ])
   → getAIRecommendationsData() → setState({ AIRecommendationsData })
   ```

3. **Props Propagation:**
   ```
   HomePage state
   → Child components receive data via props
   → Components render conditionally based on data availability
   ```

### No Global State
- All state is local to HomePage component
- No Redux, Context API, or state management libraries
- Simple prop drilling for data distribution

---

## API Integration

### 1. Financial Modeling Prep (FMP) API

**Base Configuration:** `src/config/api.json`
```json
{
  "base_url": "https://financialmodelingprep.com",
  "apikey": "loaded from src/config/appkey.json"
}
```

#### Endpoints Used

**A. Ticker Search**
- **Path:** `/api/v3/search`
- **Method:** GET
- **Params:** `query={input}&exchange=NASDAQ&exchange=NYSE&apikey={key}`
- **Used in:** `MultiSelect` component for async stock search
- **Debounce:** 10ms

**B. TTM Ratios (Trailing Twelve Months)**
- **Path:** `/api/v3/ratios-ttm/{ticker}`
- **Method:** GET
- **Used in:** `HomePage.getTickerData()`
- **Returns:** Current financial metrics (P/E, ROE, debt ratios, etc.)
- **File location:** `src/homepage/index.js:53`

**C. Income Statements**
- **Path:** `/api/v3/income-statement/{ticker}`
- **Method:** GET
- **Params:** `period=annual&limit=5&apikey={key}`
- **Used in:** `HomePage.getIncomeStmtData()`
- **Returns:** 5 years of annual financial data
- **File location:** `src/homepage/index.js:64`

### 2. AI Backend API

**Base URL Selection:**
```javascript
const baseUrl = process.env.REACT_APP_USE_LOCAL_API === 'true'
  ? 'http://127.0.0.1:8000'
  : 'https://stockagent.onrender.com';
```

#### Endpoint

**Stock Analysis**
- **Path:** `/analyze-stocks`
- **Method:** GET
- **Params:** `tickers={ticker1},{ticker2},...`
- **Used in:** `HomePage.getAIRecommendationsData()`
- **Returns:** AI-generated stock analysis and recommendations
- **File location:** `src/homepage/index.js:77`

### API Error Handling

**Current Implementation:**
```javascript
.catch((error) => {
  console.error("Error", error);
});
```

**⚠️ Issue:** No user-facing error messages or retry logic

---

## Component Reference

### Container Component

#### HomePage (`src/homepage/index.js`)
**Type:** Class component
**Lines:** 202
**Purpose:** Main application container

**State:**
- `tickerData` - Financial metrics
- `incomeStmtdata` - Historical data
- `multiSelectInput` - Selected tickers
- `AIRecommendationsData` - AI analysis
- `aiLoader` - Loading state

**Key Methods:**
- `handleSubmit()` - Orchestrates all API calls
- `getTickerData()` - Fetches TTM ratios
- `getIncomeStmtData()` - Fetches 5-year data
- `getAIRecommendationsData()` - Fetches AI analysis
- `handleMultiSelectInputChange()` - Updates selected tickers

**Metrics Configuration:**
```javascript
this.basicMetrics = [
  { key: 'priceEarningsRatioTTM', label: 'P/E Ratio', better: 'lower', desc: '...', info: '...' },
  // ... 11 more metrics
]
```

### Presentation Components

#### MultiSelect (`src/components/MultiSelect/index.js`)
**Type:** Functional component
**Lines:** 74
**Purpose:** Async stock ticker search and selection

**Props:**
- `onChange` - Callback for selection changes
- `value` - Currently selected tickers

**Features:**
- Debounced search (10ms)
- Multi-select capability
- NASDAQ/NYSE filtering
- Async data loading from FMP API

#### MetricsTable (`src/components/MetricsTable/index.js`)
**Type:** Functional component
**Lines:** 76
**Purpose:** Display and compare financial metrics

**Props:**
- `metricsData` - Array of financial metrics
- `metrics` - Metric configuration (labels, descriptions)

**Features:**
- Color-coded best values (`.upcolor` class)
- Formatted numbers
- Tooltips with descriptions

#### ChartSection (`src/components/ChartSection/index.js`)
**Type:** Functional component
**Lines:** 29
**Purpose:** Wrapper for stock charts with data processing

**Props:**
- `data` - Raw income statement data
- `multiSelectInput` - Selected tickers

**Data Processing:**
1. Sorts data by date (`sortByDate`)
2. Adds percentage growth calculations (`addPercentageGrowth`)
3. Renders charts for revenue and net income

#### AIRecommendations (`src/components/AIRecommendations/index.js`)
**Type:** Functional component
**Lines:** 160
**Purpose:** Display AI-generated stock analysis

**Props:**
- `data` - AI analysis response object

**Features:**
- Markdown-style formatting
- Best/worst stock highlights
- Key factors display
- Recommendation summary

#### StockboardBarChart (`src/components/StockboardBarChart/index.js`)
**Type:** Functional component
**Lines:** 32
**Purpose:** Individual bar chart for single stock

**Props:**
- `data` - Chart data array
- `dataKey` - Metric to display (revenue/netIncome)
- `barColor` - Chart bar color
- `width` - Chart width

**Uses:** Recharts library

### Utility Components

#### Loader (`src/components/Loader/index.js`)
**Type:** Functional component
**Lines:** 12
**Purpose:** Loading spinner using Semantic UI

#### Divider (`src/components/Divider/index.js`)
**Type:** Functional component
**Lines:** 11
**Purpose:** Visual section separator

#### Footer (`src/components/Footer/index.js`)
**Type:** Functional component
**Lines:** 18
**Purpose:** Page footer with copyright

#### CustomTooltip (`src/components/CustomTooltip/index.js`)
**Type:** Functional component
**Lines:** 18
**Purpose:** Custom tooltip for Recharts

---

## Development Workflow

### Local Development

1. **Start Development Server:**
   ```bash
   npm start
   # Runs on http://localhost:3000
   ```

2. **Start with Local AI Backend:**
   ```bash
   npm run start:local
   # Uses http://127.0.0.1:8000 for AI API
   ```

3. **Run Tests:**
   ```bash
   npm test
   ```

### Environment Variables

**Production (`.env.production`):**
```
REACT_APP_VERCEL_ANALYTICS_ID=<analytics_id>
```

**Local Development (create `.env.local`):**
```
REACT_APP_USE_LOCAL_API=true
```

### Git Workflow

**Current Branch:** `main`
**Status:** Clean (as of last check)

**Recent Commits:**
- `9b965db` - fix: local
- `64c4b58` - revert yarn
- `d26ffc9` - new ai recommendation
- `d923b5a` - update color
- `27be20d` - update for seo index.html

---

## Build & Deployment

### Build Process

```bash
npm run build
# Creates optimized production build in /build directory
```

**Build Configuration:**
- Tool: Create React App (react-scripts)
- Output: `/build` (gitignored)
- Optimization: Code splitting, minification, source maps

### Deployment (Vercel)

**Platform:** Vercel
**URL:** https://stocklele.best

**Deployment Trigger:**
- Automatic on push to main branch

**Environment Variables (set in Vercel):**
- `REACT_APP_VERCEL_ANALYTICS_ID`

**Analytics:**
- Custom web vitals integration in `src/vitals.js`

### Browser Support

**Production:**
- >0.2% market share
- Not dead browsers
- Not Opera Mini

**Development:**
- Latest Chrome
- Latest Firefox
- Latest Safari

---

## Code Conventions

### Component Structure

**Class Components:**
```javascript
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { /* ... */ };
  }

  componentDidMount() { /* ... */ }

  render() { /* ... */ }
}
```

**Functional Components:**
```javascript
const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### File Naming
- Components: `index.js` in component directory
- Styles: `index.css` or component-specific CSS
- Utilities: Descriptive names (`index.js` in utils)

### Styling Conventions

**CSS Classes:**
- `.show` / `.hide` - Display toggling
- `.upcolor` - Highlight best values (green)
- Responsive breakpoint: `@media (max-width: 480px)`

**Color Palette:**
- Primary action buttons: Semantic UI defaults
- Chart colors: Dynamic based on stock ticker
- Success/positive: Green (`.upcolor`)

### Utility Functions (`src/utils/index.js`)

```javascript
numberFormater(num)           // Format large numbers (1K, 1M, 1B)
sortByDate(data)              // Sort by date descending
trimSentence(text, length)    // Truncate text
debounce(func, delay)         // Debounce function calls
addPercentageGrowth(data)     // Calculate YoY % growth
roundToTwoDecimals(num)       // Round to 2 decimal places
```

---

## Known Issues & Technical Debt

### Security Issues

1. **API Keys in Source Control**
   - **File:** `src/config/appkey.json`
   - **Issue:** API keys committed to git
   - **Fix:** Move to environment variables
   - **Priority:** HIGH

### Code Quality Issues

1. **Unused State Variable**
   - **Location:** `src/homepage/index.js:24`
   - **Variable:** `inputTicker`
   - **Issue:** Defined but never used
   - **Fix:** Remove or implement functionality

2. **Commented Out Code**
   - **Location:** `src/homepage/index.js:48-51`
   - **Code:** `handleTickerChange()` method
   - **Fix:** Remove if not needed

3. **Backup File in Source**
   - **File:** `src/homepage/backup-homepage.js`
   - **Issue:** Backup file committed to repo
   - **Fix:** Remove and rely on git history

4. **Console.log Statements**
   - **Locations:** Multiple files
   - **Issue:** Debug logs in production
   - **Fix:** Remove or use proper logging

5. **No Error UI**
   - **Issue:** API errors only logged to console
   - **Fix:** Add user-facing error messages
   - **Priority:** MEDIUM

### Architecture Issues

1. **Class Component in Modern React**
   - **Location:** `src/homepage/index.js`
   - **Issue:** Uses legacy class component pattern
   - **Fix:** Migrate to functional component with hooks
   - **Priority:** LOW (works fine, but not modern)

2. **No Global State Management**
   - **Issue:** State drilling from HomePage
   - **Impact:** Limited scalability
   - **Fix:** Consider Context API for future features
   - **Priority:** LOW (not needed yet)

---

## Common Development Tasks

### Adding a New Financial Metric

1. **Update metric configuration** (`src/homepage/index.js:25-42`):
   ```javascript
   this.basicMetrics = [
     // ...existing metrics
     {
       key: 'yourMetricKey',           // Must match FMP API response key
       label: 'Display Name',
       better: 'higher',               // or 'lower'
       desc: 'Short description',
       info: 'Detailed explanation'
     }
   ];
   ```

2. **No other changes needed** - MetricsTable component automatically renders all metrics

### Adding a New Chart

1. **Add data processing** in `ChartSection` component
2. **Create or modify chart component** using Recharts
3. **Pass processed data** as props

### Changing AI Backend URL

**For development:**
```bash
npm run start:local
```

**For production:**
Update `src/homepage/index.js:77` or use environment variable

### Updating Styles

**Component-specific:**
Edit component's CSS file (e.g., `src/components/MetricsTable/index.css`)

**Global:**
Edit `src/homepage/index.css` or `src/index.css`

**Responsive:**
Use existing breakpoint pattern:
```css
@media (max-width: 480px) {
  /* Mobile styles */
}
```

### Testing Changes Locally

1. Start dev server: `npm start`
2. Test with multiple stocks (e.g., AAPL, MSFT, GOOGL)
3. Check all three tabs: Charts, AI Stock Advisor, Metrics
4. Test responsive design (resize browser < 480px)
5. Check browser console for errors

### Deploying to Production

1. Commit changes to main branch
2. Push to GitHub
3. Vercel automatically deploys
4. Monitor deployment at Vercel dashboard
5. Verify at https://stocklele.best

---

## Utility Function Reference

### `numberFormater(num)`
**Location:** `src/utils/index.js`
**Purpose:** Format large numbers with K/M/B suffixes

**Usage:**
```javascript
numberFormater(1500000)  // "1.5M"
numberFormater(5000)     // "5K"
```

### `sortByDate(data)`
**Location:** `src/utils/index.js`
**Purpose:** Sort array by date field (descending)

**Usage:**
```javascript
const sorted = sortByDate(incomeStatements);
```

### `addPercentageGrowth(data)`
**Location:** `src/utils/index.js`
**Purpose:** Calculate year-over-year percentage growth

**Usage:**
```javascript
const withGrowth = addPercentageGrowth(revenueData);
// Adds 'revenueGrowth%' or 'netIncomeGrowth%' fields
```

### `trimSentence(text, maxLength)`
**Location:** `src/utils/index.js`
**Purpose:** Truncate text with ellipsis

**Usage:**
```javascript
trimSentence("Long text here...", 50)  // "Long text here..."
```

### `debounce(func, delay)`
**Location:** `src/utils/index.js`
**Purpose:** Debounce function calls

**Usage:**
```javascript
const debouncedSearch = debounce(searchFunction, 10);
```

---

## Quick Reference

### File Locations Cheat Sheet

| What | Where |
|------|-------|
| Main app logic | `src/homepage/index.js` |
| API configuration | `src/config/api.json` |
| API keys | `src/config/appkey.json` ⚠️ |
| Utility functions | `src/utils/index.js` |
| Stock search dropdown | `src/components/MultiSelect/index.js` |
| Metrics table | `src/components/MetricsTable/index.js` |
| Charts | `src/components/ChartSection/index.js` |
| AI recommendations | `src/components/AIRecommendations/index.js` |
| SEO meta tags | `public/index.html` |
| Environment variables | `.env.production`, `.env.local` |

### API Endpoints Cheat Sheet

| API | Endpoint | Purpose |
|-----|----------|---------|
| FMP | `/api/v3/search` | Search stock tickers |
| FMP | `/api/v3/ratios-ttm/{ticker}` | Get current metrics |
| FMP | `/api/v3/income-statement/{ticker}` | Get 5-year data |
| AI Backend | `/analyze-stocks?tickers=...` | Get AI analysis |

### State Variables Cheat Sheet

| Variable | Type | Purpose |
|----------|------|---------|
| `tickerData` | Array | Current financial metrics |
| `incomeStmtdata` | Array | 5-year historical data |
| `multiSelectInput` | Array | Selected stock tickers |
| `AIRecommendationsData` | Object | AI analysis response |
| `aiLoader` | Boolean | AI loading state |

---

## Development Best Practices

### When Adding Features
1. ✅ Read existing code first
2. ✅ Follow existing patterns
3. ✅ Test with multiple stocks
4. ✅ Check responsive design
5. ✅ Remove console.logs before commit

### When Fixing Bugs
1. ✅ Reproduce the issue
2. ✅ Check browser console
3. ✅ Verify API responses
4. ✅ Test edge cases
5. ✅ Don't break existing functionality

### When Refactoring
1. ✅ Make small, incremental changes
2. ✅ Test after each change
3. ✅ Don't over-engineer
4. ✅ Keep it simple
5. ✅ Maintain backward compatibility

---

## Contact & Resources

### External Documentation
- [React 18 Docs](https://react.dev/)
- [Semantic UI React](https://react.semantic-ui.com/)
- [Recharts](https://recharts.org/)
- [FMP API Docs](https://financialmodelingprep.com/developer/docs/)
- [Create React App](https://create-react-app.dev/)

### Project Resources
- **Live Site:** https://stocklele.best
- **Deployment:** Vercel Dashboard
- **Repository:** (Add your repo URL here)

---

## Conclusion

This guide provides a comprehensive overview of the Stocklele codebase architecture, patterns, and conventions. When working on this project:

1. **Prioritize simplicity** - Don't over-engineer solutions
2. **Follow existing patterns** - Maintain consistency
3. **Test thoroughly** - Multi-stock scenarios and responsive design
4. **Address technical debt** - Especially security issues
5. **Keep this guide updated** - As architecture evolves

For questions or clarifications about specific components or patterns, refer to the inline code comments and this guide.

**Happy coding!** 🚀
