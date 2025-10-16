import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaFilter, FaSearch } from 'react-icons/fa';
import './ExplorePage.css';

const ExplorePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: 'active',
  });

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/campaigns', { params: filters });
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (budget) => {
    return `${budget.total} BNB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  return (
    <div className="explore-page">
      <div className="container">
        <div className="page-header">
          <h1>Campaigns</h1>
          <p>Find the right campaign and start earning</p>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <FaFilter />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="contest">Contests</option>
              <option value="deal">Deals</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="tech">Tech</option>
              <option value="food">Food</option>
              <option value="fitness">Fitness</option>
              <option value="gaming">Gaming</option>
              <option value="lifestyle">Lifestyle</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state">
            <h3>No campaigns found</h3>
            <p>Try changing filters</p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <Link
                to={`/campaign/${campaign._id}`}
                key={campaign._id}
                className="campaign-card"
              >
                <div className="campaign-header">
                  <span className={`campaign-type badge badge-${campaign.type === 'contest' ? 'primary' : 'success'}`}>
                    {campaign.type === 'contest' ? 'Contest' : 'Deal'}
                  </span>
                  <span className="campaign-category">{campaign.category}</span>
                </div>

                {campaign.media?.images?.[0] && (
                  <div className="campaign-image">
                    <img src={campaign.media.images[0]} alt={campaign.title} />
                  </div>
                )}

                <div className="campaign-content">
                  <h3 className="campaign-title">{campaign.title}</h3>
                  <p className="campaign-description">
                    {campaign.description.substring(0, 120)}...
                  </p>

                  <div className="campaign-meta">
                    <div className="meta-item">
                      <span className="meta-label">Budget:</span>
                      <span className="meta-value">{formatBudget(campaign.budget)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Submissions:</span>
                      <span className="meta-value">{campaign.stats.totalSubmissions}</span>
                    </div>
                  </div>

                  <div className="campaign-footer">
                    <div className="campaign-brand">
                      {campaign.brand?.profile?.displayName || 'Brand'}
                    </div>
                    <div className="campaign-deadline">
                      Until: {formatDate(campaign.duration.endDate)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
