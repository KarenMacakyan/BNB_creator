import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { FaTiktok, FaTwitter, FaCalendar, FaTrophy, FaEye } from 'react-icons/fa';
import './CampaignDetailsPage.css';

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const { account } = useWeb3();
  const { user } = useUser();
  const [campaign, setCampaign] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    fetchCampaignDetails();
    fetchSubmissions();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await axios.get(`/api/campaigns/${id}`);
      setCampaign(response.data.campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast.error('Error loading campaign');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`/api/submissions/campaign/${id}`);
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const isOwner = campaign && account && campaign.brandWallet.toLowerCase() === account.toLowerCase();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Campaign not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-details-page">
      <div className="campaign-hero">
        <div className="container">
          <div className="campaign-hero-content">
            <div className="campaign-badges">
              <span className={`badge badge-${campaign.type === 'contest' ? 'primary' : 'success'}`}>
                {campaign.type === 'contest' ? 'Contest' : 'Deal'}
              </span>
              <span className="badge badge-warning">{campaign.category}</span>
            </div>
            <h1 className="campaign-hero-title">{campaign.title}</h1>
            <p className="campaign-hero-description">{campaign.description}</p>
            
            <div className="campaign-stats">
              <div className="stat">
                <div className="stat-value">{campaign.budget.total} BNB</div>
                <div className="stat-label">Budget</div>
              </div>
              <div className="stat">
                <div className="stat-value">{submissions.length}</div>
                <div className="stat-label">Submissions</div>
              </div>
              <div className="stat">
                <div className="stat-value">{campaign.stats.totalViews}</div>
                <div className="stat-label">Views</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="campaign-layout">
          <div className="campaign-main">
            <div className="card">
              <h2>Requirements</h2>
              <div className="requirements">
                <div className="requirement-item">
                  <strong>Platforms:</strong>
                  <div className="platforms">
                    {campaign.requirements.platforms?.map((platform) => (
                      <span key={platform} className="platform-badge">
                        {platform === 'tiktok' ? <FaTiktok /> : <FaTwitter />}
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                {campaign.requirements.minFollowers && (
                  <div className="requirement-item">
                    <strong>Minimum followers:</strong> {campaign.requirements.minFollowers}
                  </div>
                )}
                <div className="requirement-item">
                  <strong>Content type:</strong> {campaign.requirements.contentType}
                </div>
                {campaign.requirements.guidelines && (
                  <div className="requirement-item">
                    <strong>Guidelines:</strong>
                    <p>{campaign.requirements.guidelines}</p>
                  </div>
                )}
                {campaign.requirements.hashtags?.length > 0 && (
                  <div className="requirement-item">
                    <strong>Hashtags:</strong>
                    <div className="tags">
                      {campaign.requirements.hashtags.map((tag) => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {campaign.prizes?.length > 0 && (
              <div className="card">
                <h2>Prizes</h2>
                <div className="prizes">
                  {campaign.prizes.map((prize) => (
                    <div key={prize.place} className="prize-item">
                      <FaTrophy className="prize-icon" />
                      <div className="prize-details">
                        <div className="prize-place">Place {prize.place}</div>
                        <div className="prize-amount">{prize.amount} BNB</div>
                        {prize.description && (
                          <div className="prize-description">{prize.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user?.role === 'creator' && !isOwner && (
              <div className="card">
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Submit Entry
                </button>
              </div>
            )}

            <div className="card">
              <h2>Submissions ({submissions.length})</h2>
              {submissions.length === 0 ? (
                <p className="empty-text">No submissions yet</p>
              ) : (
                <div className="submissions-list">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="submission-item">
                      <div className="submission-creator">
                        {submission.creator?.profile?.displayName || 'Anonymous'}
                      </div>
                      <div className="submission-platform">
                        {submission.platform === 'tiktok' ? <FaTiktok /> : <FaTwitter />}
                      </div>
                      <div className="submission-views">
                        <FaEye /> {submission.metrics.views}
                      </div>
                      <a 
                        href={submission.content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="campaign-sidebar">
            <div className="card">
              <h3>Timeline</h3>
              <div className="dates">
                <div className="date-item">
                  <FaCalendar />
                  <div>
                    <div className="date-label">Start</div>
                    <div className="date-value">
                      {new Date(campaign.duration.startDate).toLocaleDateString('en-US')}
                    </div>
                  </div>
                </div>
                <div className="date-item">
                  <FaCalendar />
                  <div>
                    <div className="date-label">End</div>
                    <div className="date-value">
                      {new Date(campaign.duration.endDate).toLocaleDateString('en-US')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Brand</h3>
              <div className="brand-info">
                <div className="brand-name">
                  {campaign.brand?.profile?.displayName || 'Brand'}
                </div>
                {campaign.brand?.profile?.bio && (
                  <p className="brand-bio">{campaign.brand.profile.bio}</p>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="card">
                <h3>Management</h3>
                <div className="owner-actions">
                  <div className="budget-info">
                    <div>Remaining budget:</div>
                    <div className="budget-value">{campaign.budget.remaining} BNB</div>
                  </div>
                  <button className="btn btn-secondary" style={{ width: '100%' }}>
                    Close Campaign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;
