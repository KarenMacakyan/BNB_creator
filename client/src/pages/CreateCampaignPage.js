import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CreateCampaignPage.css';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { account, createCampaign: createCampaignOnChain } = useWeb3();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'contest',
    category: 'lifestyle',
    totalBudget: '',
    platforms: ['tiktok'],
    minFollowers: '',
    contentType: '',
    guidelines: '',
    hashtags: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    prizes: [
      { place: 1, amount: '', description: '' },
      { place: 2, amount: '', description: '' },
      { place: 3, amount: '', description: '' },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlatformChange = (platform) => {
    const platforms = formData.platforms.includes(platform)
      ? formData.platforms.filter((p) => p !== platform)
      : [...formData.platforms, platform];
    setFormData({ ...formData, platforms });
  };

  const handlePrizeChange = (index, field, value) => {
    const prizes = [...formData.prizes];
    prizes[index][field] = value;
    setFormData({ ...formData, prizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error('Connect wallet');
      return;
    }

    if (user?.role !== 'brand') {
      toast.error('Only brands can create campaigns');
      return;
    }

    if (!formData.title || !formData.description || !formData.totalBudget) {
      toast.error('Fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // 1. Create campaign in smart contract
      const metadataURI = JSON.stringify({
        title: formData.title,
        description: formData.description,
      });

      const contractId = await createCampaignOnChain(metadataURI, formData.totalBudget);

      if (!contractId) {
        throw new Error('Failed to create campaign on blockchain');
      }

      // 2. Save to database
      const campaignData = {
        contractId,
        brandWallet: account,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        budget: {
          total: parseFloat(formData.totalBudget),
          remaining: parseFloat(formData.totalBudget),
          currency: 'BNB',
        },
        prizes: formData.prizes
          .filter((p) => p.amount)
          .map((p) => ({
            ...p,
            amount: parseFloat(p.amount),
          })),
        requirements: {
          platforms: formData.platforms,
          minFollowers: formData.minFollowers ? parseInt(formData.minFollowers) : undefined,
          contentType: formData.contentType,
          guidelines: formData.guidelines,
          hashtags: formData.hashtags.split(',').map((h) => h.trim()).filter(Boolean),
        },
        duration: {
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        },
        status: 'active',
      };

      const response = await axios.post('/api/campaigns', campaignData);

      toast.success('Campaign created successfully!');
      navigate(`/campaign/${response.data.campaign._id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign-page">
      <div className="container">
        <div className="page-header">
          <h1>Create Campaign</h1>
          <p>Launch a campaign and find creators for your brand</p>
        </div>

        <form onSubmit={handleSubmit} className="campaign-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label className="form-label">Campaign Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Your campaign title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe your campaign, goals and requirements"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Campaign Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="contest">Contest</option>
                  <option value="deal">Deal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty</option>
                  <option value="tech">Tech</option>
                  <option value="food">Food</option>
                  <option value="fitness">Fitness</option>
                  <option value="gaming">Gaming</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Budget and Prizes</h2>

            <div className="form-group">
              <label className="form-label">Total Budget (BNB) *</label>
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                className="form-input"
                placeholder="0.0"
                step="0.001"
                min="0"
                required
              />
              <small className="form-hint">Funds will be locked in the smart contract</small>
            </div>

            {formData.type === 'contest' && (
              <div className="prizes-section">
                <h3>Prize Places</h3>
                {formData.prizes.map((prize, index) => (
                  <div key={prize.place} className="prize-form">
                    <h4>Place {prize.place}</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Amount (BNB)</label>
                        <input
                          type="number"
                          value={prize.amount}
                          onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
                          className="form-input"
                          placeholder="0.0"
                          step="0.001"
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          value={prize.description}
                          onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                          className="form-input"
                          placeholder="e.g. Grand Prize"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Requirements</h2>

            <div className="form-group">
              <label className="form-label">Platforms *</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes('tiktok')}
                    onChange={() => handlePlatformChange('tiktok')}
                  />
                  TikTok
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes('twitter')}
                    onChange={() => handlePlatformChange('twitter')}
                  />
                  X (Twitter)
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Minimum Followers</label>
                <input
                  type="number"
                  name="minFollowers"
                  value={formData.minFollowers}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="1000"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Content Type</label>
                <input
                  type="text"
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Video review, Product demonstration"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Guidelines</label>
              <textarea
                name="guidelines"
                value={formData.guidelines}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Additional guidelines for creators"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hashtags (comma separated)</label>
              <input
                type="text"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleChange}
                className="form-input"
                placeholder="hashtag1, hashtag2, hashtag3"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Timeline</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
