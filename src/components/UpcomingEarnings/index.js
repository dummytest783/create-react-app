import React from 'react';
import { Icon } from 'semantic-ui-react';
import './index.scss';

const UpcomingEarnings = ({ earningsData, onCompanyClick }) => {
  if (!earningsData || !earningsData.earnings_calendar || earningsData.earnings_calendar.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time part for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    const options = { month: 'short', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatEPS = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `$${value.toFixed(2)}`;
  };

  const getDaysUntil = (dateString) => {
    const earningsDate = new Date(dateString);
    const today = new Date();
    earningsDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = earningsDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    return `in ${diffDays} days`;
  };

  const getGrowthColor = (growth) => {
    if (growth >= 50) return 'growth-exceptional';
    if (growth >= 30) return 'growth-high';
    if (growth >= 15) return 'growth-medium';
    return 'growth-low';
  };

  const formatPercentage = (value) => {
    return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  // Group earnings by date
  const earningsByDate = earningsData.earnings_calendar.reduce((acc, earning) => {
    const date = earning.earnings_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(earning);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(earningsByDate).sort();

  return (
    <div className="upcoming-earnings-container">
      <div className="upcoming-earnings-header">
        <div className="header-title-row">
          <Icon name="calendar alternate outline" className="title-icon" />
          <h2 className="header-text">Upcoming Earnings Calendar</h2>
        </div>
        <p className="header-subtitle">
          Earnings reports from high-growth companies in the next 14 days
          <span className="date-range">
            {earningsData.date_range && (
              <>
                {new Date(earningsData.date_range.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' - '}
                {new Date(earningsData.date_range.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </>
            )}
          </span>
        </p>
      </div>

      <div className="earnings-timeline">
        {sortedDates.map((date, dateIndex) => (
          <div key={dateIndex} className="earnings-date-group">
            <div className="date-header">
              <div className="date-indicator">
                <div className="date-dot"></div>
                <div className="date-line"></div>
              </div>
              <div className="date-info">
                <h3 className="date-primary">{formatDate(date)}</h3>
                <span className="date-secondary">{getDaysUntil(date)}</span>
              </div>
            </div>

            <div className="earnings-cards">
              {earningsByDate[date].map((earning, earningIndex) => (
                <div
                  key={earningIndex}
                  className="earning-card"
                  onClick={() => onCompanyClick && onCompanyClick(earning.symbol, earning.company_name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onCompanyClick && onCompanyClick(earning.symbol, earning.company_name)}
                >
                  <div className="earning-card-header">
                    <div className="company-identity">
                      <span className="company-symbol">{earning.symbol}</span>
                      <span className="company-name-separator">•</span>
                      <span className="company-name">{earning.company_name}</span>
                    </div>
                    <div className="company-badges">
                      <div className={`badge growth-badge ${getGrowthColor(earning.current_growth_pct)}`}>
                        {formatPercentage(earning.current_growth_pct)}
                      </div>
                    </div>
                  </div>

                  <div className="earning-card-body">
                    <div className="estimates-grid">
                      <div className="estimate-item">
                        <div className="estimate-label">
                          <Icon name="tag" />
                          Industry
                        </div>
                        <div className="estimate-value industry-value">
                          {earning.industry_name}
                        </div>
                        {earning.company_rank_in_industry && (
                          <div className="rank-info">
                            Rank #{earning.company_rank_in_industry}
                          </div>
                        )}
                      </div>

                      <div className="estimate-item">
                        <div className="estimate-label">
                          <Icon name="dollar sign" />
                          EPS Estimate
                        </div>
                        <div className="estimate-value eps-value">
                          {formatEPS(earning.eps_estimated)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEarnings;
