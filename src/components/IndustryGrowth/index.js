import React, { useEffect, useState } from 'react';
import { Header, Icon, Loader } from 'semantic-ui-react';
import api from '../../config/api.json';
import './index.scss';

const IndustryGrowth = () => {
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndustries, setExpandedIndustries] = useState(new Set());

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      // Use localhost for development
      const baseUrl = api.stockAgent.local;
      // For production, change to: api.stockAgent.production

      const response = await fetch(`${baseUrl}${api.stockAgent.growthResultsApi}?limit_industries=5&limit_companies=5`);

      if (!response.ok) {
        throw new Error('Failed to fetch growth data');
      }

      const data = await response.json();
      setGrowthData(data);

      // Auto-expand all industries by default
      if (data.industries && data.industries.length > 0) {
        const allIndices = data.industries.map((_, index) => index);
        setExpandedIndustries(new Set(allIndices));
      }
    } catch (err) {
      console.error('Error fetching growth data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleIndustry = (index) => {
    const newExpanded = new Set(expandedIndustries);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIndustries(newExpanded);
  };

  const formatPercentage = (value) => {
    return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  const formatRevenue = (value) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  };

  const getGrowthColor = (growth) => {
    if (growth >= 50) return 'growth-exceptional';
    if (growth >= 30) return 'growth-high';
    if (growth >= 15) return 'growth-medium';
    return 'growth-low';
  };

  if (loading) {
    return (
      <div className="industry-growth-container">
        <div className="industry-growth-loader">
          <Loader active inline="centered" size="large">
            Loading top growing industries...
          </Loader>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="industry-growth-container">
        <div className="industry-growth-error">
          <Icon name="exclamation triangle" size="large" />
          <p>Unable to load growth data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!growthData || !growthData.industries || growthData.industries.length === 0) {
    return null;
  }

  return (
    <div className="industry-growth-container">
      <Header as="h2" className="industry-growth-header">
        <Icon name="chart line" />
        <Header.Content>
          Top Growing Industries & Companies
          <Header.Subheader>
            Discover high-growth opportunities across different sectors
          </Header.Subheader>
        </Header.Content>
      </Header>

      <div className="industries-grid">
        {growthData.industries.map((industry, index) => {
          const isExpanded = expandedIndustries.has(index);

          return (
            <div key={index} className="industry-card">
              <div
                className="industry-header"
                onClick={() => toggleIndustry(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleIndustry(index)}
              >
                <div className="industry-header-left">
                  <span className="industry-rank">{getRankEmoji(industry.rank)}</span>
                  <div className="industry-info">
                    <h3 className="industry-name">{industry.industry_name}</h3>
                    <span className="industry-score">
                      Industry Growth Score: {industry.industry_growth_score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="industry-header-right">
                  <span className={`industry-growth ${getGrowthColor(industry.industry_growth_score)}`}>
                    {formatPercentage(industry.industry_growth_score)}
                  </span>
                  <Icon name={isExpanded ? 'chevron up' : 'chevron down'} />
                </div>
              </div>

              {isExpanded && (
                <div className="companies-list">
                  <div className="companies-header">
                    <span className="header-rank">Rank</span>
                    <span className="header-company">Company</span>
                    <span className="header-growth">Growth</span>
                    <span className="header-revenue">Revenue Trend</span>
                  </div>

                  {industry.companies.map((company, compIndex) => (
                    <div key={compIndex} className="company-row">
                      <span className="company-rank">
                        {company.rank === 1 ? '🏆' :
                         company.rank === 2 ? '🥈' :
                         company.rank === 3 ? '🥉' :
                         `${company.rank}.`}
                      </span>

                      <div className="company-info">
                        <div className="company-main">
                          <span className="company-symbol">{company.symbol}</span>
                          <span className="company-name">{company.company_name}</span>
                        </div>
                      </div>

                      <span className={`company-growth ${getGrowthColor(company.current_growth_pct)}`}>
                        {formatPercentage(company.current_growth_pct)}
                      </span>

                      <div className="company-revenue">
                        <div className="revenue-line">
                          <span className="revenue-year">{company.fiscal_year_y2}:</span>
                          <span className="revenue-value">{formatRevenue(company.revenue_y2)}</span>
                        </div>
                        <Icon name="arrow right" className="revenue-arrow" />
                        <div className="revenue-line">
                          <span className="revenue-year">{company.fiscal_year_y3}:</span>
                          <span className="revenue-value revenue-highlight">{formatRevenue(company.revenue_y3)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {growthData.calculated_at && (
        <div className="industry-growth-footer">
          <Icon name="clock outline" />
          <span>Last updated: {new Date(growthData.calculated_at).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default IndustryGrowth;
