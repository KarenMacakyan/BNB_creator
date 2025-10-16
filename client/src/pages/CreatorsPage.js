import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTiktok, FaTwitter, FaUsers } from 'react-icons/fa';
import './CreatorsPage.css';

const CreatorsPage = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minFollowers: '',
    platform: '',
  });

  useEffect(() => {
    fetchCreators();
  }, [filters]);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/creators', { params: filters });
      setCreators(response.data.creators);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creators-page">
      <div className="container">
        <div className="page-header">
          <h1>Creators</h1>
          <p>Find creators for your campaign</p>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <input
              type="number"
              placeholder="Minimum followers"
              value={filters.minFollowers}
              onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })}
              className="form-input"
            />
            <select
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
              className="form-select"
            >
              <option value="">All Platforms</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : creators.length === 0 ? (
          <div className="empty-state">
            <h3>No creators found</h3>
            <p>Try changing filters</p>
          </div>
        ) : (
          <div className="creators-grid">
            {creators.map((creator) => (
              <Link
                to={`/profile/${creator.walletAddress}`}
                key={creator._id}
                className="creator-card"
              >
                <div className="creator-avatar">
                  {creator.profile?.avatar ? (
                    <img src={creator.profile.avatar} alt={creator.profile.displayName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {creator.profile?.displayName?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="creator-info">
                  <h3 className="creator-name">
                    {creator.profile?.displayName || 'Anonymous'}
                  </h3>
                  {creator.profile?.bio && (
                    <p className="creator-bio">
                      {creator.profile.bio.substring(0, 100)}...
                    </p>
                  )}
                  <div className="creator-stats">
                    {creator.stats.tiktokFollowers > 0 && (
                      <div className="stat-item">
                        <FaTiktok />
                        {creator.stats.tiktokFollowers.toLocaleString()}
                      </div>
                    )}
                    {creator.stats.twitterFollowers > 0 && (
                      <div className="stat-item">
                        <FaTwitter />
                        {creator.stats.twitterFollowers.toLocaleString()}
                      </div>
                    )}
                    {creator.stats.totalEarned > 0 && (
                      <div className="stat-item earned">
                        💰 {creator.stats.totalEarned.toFixed(2)} BNB
                      </div>
                    )}
                  </div>
                  <div className="creator-footer">
                    <span className="submissions-count">
                      <FaUsers /> {creator.stats.successfulSubmissions} successful submissions
                    </span>
                    {creator.isVerified && (
                      <span className="verified-badge">✓</span>
                    )}
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

export default CreatorsPage;
