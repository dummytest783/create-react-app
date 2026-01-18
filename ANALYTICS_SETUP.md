# Analytics Setup Guide

## Overview

Your Stocklele app now tracks 3 key metrics using Google Analytics 4 (GA4):

1. **Daily Website Visitors** - Automatic page view tracking
2. **Stock Searches** - When users select stocks from the search dropdown
3. **AI Stock Advisor Clicks** - When users click the AI Stock Advisor tab

---

## Setup Instructions

### Step 1: Create a Google Analytics 4 Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left gear icon)
3. Click **Create Property**
4. Enter property name: "Stocklele"
5. Set timezone and currency
6. Click **Next** → Choose "Web" platform
7. Enter website URL: `https://stocklele.best`
8. Click **Create Stream**

### Step 2: Get Your Measurement ID

After creating the stream, you'll see:
- **Measurement ID**: Looks like `G-XXXXXXXXXX`
- Copy this ID

### Step 3: Add Environment Variable

Create or update your `.env` file in the `create-react-app` directory:

```bash
# Add this line to your .env file
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 2.

### Step 4: Restart Your Development Server

```bash
npm start
```

Or for production build:

```bash
npm run build
```

---

## What Gets Tracked

### 1. Page Views (Daily Visitors)

**When:** Every time someone visits any page on your site

**Where to View in GA4:**
- Reports → Life Cycle → Acquisition → Traffic acquisition
- Reports → Life Cycle → Engagement → Pages and screens

**Metrics You'll See:**
- Total users (daily, weekly, monthly)
- Page views per session
- Which pages are most popular

---

### 2. Stock Searches

**When:** User selects a stock from the search dropdown

**Event Name:** `Stock Selected`

**Data Captured:**
- Stock ticker symbol (e.g., "AAPL")
- Company name
- Timestamp

**Where to View in GA4:**
- Reports → Life Cycle → Engagement → Events
- Look for event named: `Stock Selected`

**Custom Report:**
1. Go to **Explore** → Create new exploration
2. Add dimension: `Event name`
3. Filter where `Event name` = `Stock Selected`
4. Add dimension: `ticker` to see which stocks are searched most

---

### 3. AI Stock Advisor Clicks (Two Entry Points)

**When:** User accesses AI Stock Advisor feature via:
  - **Tab:** Clicking "AI Stock Advisor 👑" tab on homepage (after searching stocks)
  - **Navbar:** Clicking "AI Stock Advisor" link in top navigation

**Event Name:** `AI Stock Advisor Clicked`

**Data Captured:**
- Source: `tab` or `navbar`
- Which stocks the user had selected (if any)
- Number of stocks being analyzed
- Timestamp

**Where to View in GA4:**
- Reports → Life Cycle → Engagement → Events
- Look for event named: `AI Stock Advisor Clicked`

**Metrics You'll See:**
- Total AI feature clicks
- Breakdown by source (navbar vs tab)
- How many users engage with AI features
- Which stock combinations trigger AI usage
- Navbar clicks (no stocks) vs Tab clicks (with stocks selected)

---

## Viewing Your Data

### Real-Time View

See live activity on your site:
1. Go to Google Analytics
2. Click **Reports** → **Realtime**
3. You'll see:
   - Active users right now
   - Events happening in real-time
   - Pages being viewed

### Daily Summary

Check daily visitor count:
1. **Reports** → **Life Cycle** → **Acquisition** → **User acquisition**
2. Change date range at top right
3. See metrics:
   - New users
   - Total users
   - Sessions
   - Engagement rate

### Event Reports

See specific events (stock searches, AI clicks):
1. **Reports** → **Life Cycle** → **Engagement** → **Events**
2. You'll see all events with counts:
   - `page_view`
   - `Stock Selected`
   - `AI Stock Advisor Clicked`
3. Click any event name to drill down

---

## Creating Custom Reports

### Most Searched Stocks Report

1. Go to **Explore** (left sidebar)
2. Click **Blank** template
3. Set up:
   - **Dimensions:** Add `Event name`, `ticker`
   - **Metrics:** Add `Event count`
   - **Filters:** `Event name` exactly matches `Stock Selected`
4. Drag `ticker` to ROWS
5. Drag `Event count` to VALUES
6. You'll see ranking of most searched stocks

### AI Engagement Funnel

1. **Explore** → **Funnel exploration**
2. Create funnel:
   - Step 1: `page_view` (site visit)
   - Step 2: `Stock Selected` (stock search)
   - Step 3: `AI Stock Advisor Clicked` (AI usage)
3. See conversion rates at each step

---

## Troubleshooting

### "No data showing in Google Analytics"

**Check:**
1. Is `REACT_APP_GA_MEASUREMENT_ID` set in your `.env` file?
2. Did you restart the dev server after adding the env variable?
3. Open browser console - you should see: `Analytics initialized`
4. Google Analytics can take 24-48 hours to show data initially
5. Use **Realtime** view to see immediate results

### "Analytics initialized" not showing in console

The analytics service silently fails if the Measurement ID is missing. This is expected behavior in development without the env variable.

---

## Privacy & GDPR Compliance

Google Analytics 4 is designed to be privacy-friendly, but consider:

1. **Cookie Consent Banner** (optional but recommended):
   - Install: `npm install react-cookie-consent`
   - Add to your app to let users opt-out

2. **Privacy Policy**:
   - Update your privacy policy to mention Google Analytics usage
   - Link to Google's privacy policy

3. **IP Anonymization**:
   - GA4 automatically anonymizes IP addresses

---

## Production Deployment

### Vercel (Current Hosting)

Add environment variable to Vercel:
1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `REACT_APP_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
5. Redeploy your app

### Other Hosting Platforms

Add the same environment variable through their respective dashboards.

---

## Next Steps (Optional Advanced Tracking)

If you want to add more tracking later, you can easily extend [src/analytics.js](src/analytics.js) to track:

- Chatbot interactions
- Industry dashboard clicks
- Video plays
- Tab switches (Growth → Metrics → Cash Flow)
- Time spent on each chart
- API errors

But for now, you have the 3 essential metrics you requested!

---

## Support

- **Google Analytics Help:** https://support.google.com/analytics
- **GA4 Getting Started:** https://support.google.com/analytics/answer/9304153

---

## Summary

You're now tracking:
- ✅ **Daily visitors** - Automatic page views
- ✅ **Stock searches** - Every time someone selects a stock
- ✅ **AI clicks** - When users click the AI Stock Advisor tab

All data flows to Google Analytics 4 where you can view charts, create reports, and analyze user behavior.
