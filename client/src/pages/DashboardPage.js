import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { FaRocket, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';
import './DashboardPage.css';

const DashboardPage = () => {
  const { account } = useWeb3();
  const { user } = useUser();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account && user) {
      if (user.role === 'brand') {
        fetchMyCampaigns();
      } else if (user.role === 'creator') {
        fetchMySubmissions();
      }
    }
  }, [account, user]);

  const fetchMyCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/campaigns/brand/${account}`);
      setMyCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/submissions/creator/${account}`);
      setMySubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!account || !user || user.needsRole) {
    return (
      <div className="container" style={{ padding: '48px 0' }}>
        <div className="empty-state">
          <h2>Connect wallet and select a role</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>
            {user.role === 'brand' 
              ? 'Manage your campaigns' 
              : 'Track your submissions'}
          </p>
        </div>

        {user.role === 'brand' ? (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon"><FaRocket /></div>
                <div className="stat-value">{myCampaigns.length}</div>
                <div className="stat-label">Total Campaigns</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FaCheckCircle /></div>
                <div className="stat-value">
                  {myCampaigns.filter((c) => c.status === 'active').length}
                </div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FaChartLine /></div>
                <div className="stat-value">
                  {myCampaigns.reduce((sum, c) => sum + c.stats.totalSubmissions, 0)}
                </div>
                <div className="stat-label">Total Submissions</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">
                  {myCampaigns.reduce((sum, c) => sum + c.budget.total, 0).toFixed(2)} BNB
                </div>
                <div className="stat-label">Invested</div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>My Campaigns</h2>
                <Link to="/create-campaign" className="btn btn-primary">
                  Create Campaign
                </Link>
              </div>

              {myCampaigns.length === 0 ? (
                <div className="empty-state">
                  <FaRocket style={{ fontSize: '64px', color: 'var(--gray)' }} />
                  <h3>You don't have any campaigns yet</h3>
                  <p>Create your first campaign and start working with creators</p>
                  <Link to="/create-campaign" className="btn btn-primary">
                    Create Campaign
                  </Link>
                </div>
              ) : (
                <div className="campaigns-list">
                  {myCampaigns.map((campaign) => (
                    <Link
                      to={`/campaign/${campaign._id}`}
                      key={campaign._id}
                      className="campaign-item"
                    >
                      <div className="campaign-item-header">
                        <h3>{campaign.title}</h3>
                        <span className={`status-badge status-${campaign.status}`}>
                          {campaign.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </div>
                      <div className="campaign-item-stats">
                        <div className="item-stat">
                          <span className="item-stat-label">Budget:</span>
                          <span className="item-stat-value">{campaign.budget.total} BNB</span>
                        </div>
                        <div className="item-stat">
                          <span className="item-stat-label">Submissions:</span>
                          <span className="item-stat-value">{campaign.stats.totalSubmissions}</span>
                        </div>
                        <div className="item-stat">
                          <span className="item-stat-label">Views:</span>
                          <span className="item-stat-value">{campaign.stats.totalViews}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon"><FaRocket /></div>
                <div className="stat-value">{mySubmissions.length}</div>
                <div className="stat-label">Total Submissions</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FaClock /></div>
                <div className="stat-value">
                  {mySubmissions.filter((s) => s.status === 'pending').length}
                </div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FaCheckCircle /></div>
                <div className="stat-value">
                  {mySubmissions.filter((s) => s.status === 'approved').length}
                </div>
                <div className="stat-label">Approved</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">
                  {mySubmissions.filter((s) => s.status === 'winner').length}
                </div>
                <div className="stat-label">Wins</div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>My Submissions</h2>
                <Link to="/explore" className="btn btn-primary">
                  Find Campaigns
                </Link>
              </div>

              {mySubmissions.length === 0 ? (
                <div className="empty-state">
                  <FaRocket style={{ fontSize: '64px', color: 'var(--gray)' }} />
                  <h3>You don't have any submissions yet</h3>
                  <p>Find a campaign and submit your first entry</p>
                  <Link to="/explore" className="btn btn-primary">
                    Browse Campaigns
                  </Link>
                </div>
              ) : (
                <div className="submissions-list">
                  {mySubmissions.map((submission) => (
                    <div key={submission._id} className="submission-item">
                      <div className="submission-item-header">
                        <h3>{submission.campaign?.title || 'Campaign'}</h3>
                        <span className={`status-badge status-${submission.status}`}>
                          {submission.status === 'pending' && 'Pending'}
                          {submission.status === 'approved' && 'Approved'}
                          {submission.status === 'rejected' && 'Rejected'}
                          {submission.status === 'winner' && '🏆 Winner'}
                        </span>
                      </div>
                      <div className="submission-item-stats">
                        <div className="item-stat">
                          <span className="item-stat-label">Views:</span>
                          <span className="item-stat-value">{submission.metrics.views}</span>
                        </div>
                        <div className="item-stat">
                          <span className="item-stat-label">Likes:</span>
                          <span className="item-stat-value">{submission.metrics.likes}</span>
                        </div>
                        <a 
                          href={submission.content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
