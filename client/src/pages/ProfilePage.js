import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { FaTiktok, FaTwitter, FaGlobe, FaEnvelope } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const { address } = useParams();
  const { account } = useWeb3();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const isOwnProfile = account && address.toLowerCase() === account.toLowerCase();

  useEffect(() => {
    fetchProfile();
    if (address) {
      fetchStats();
    }
  }, [address]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/profile/${address}`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      if (user?.role === 'creator') {
        const response = await axios.get(`/api/creators/${address}/stats`);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Profile not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="profile-info">
            <div className="profile-avatar">
              {user.profile?.avatar ? (
                <img src={user.profile.avatar} alt={user.profile.displayName} />
              ) : (
                <div className="avatar-placeholder">
                  {user.profile?.displayName?.[0] || '?'}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h1 className="profile-name">
                {user.profile?.displayName || 'Anonymous'}
              </h1>
              <div className="profile-address">{address}</div>
              <div className="profile-role">
                <span className={`badge badge-${user.role === 'brand' ? 'primary' : 'success'}`}>
                  {user.role === 'brand' ? 'Brand' : 'Creator'}
                </span>
                {user.isVerified && (
                  <span className="badge badge-primary">✓ Verified</span>
                )}
              </div>
              {user.profile?.bio && (
                <p className="profile-bio">{user.profile.bio}</p>
              )}
              <div className="profile-links">
                {user.social?.tiktok && (
                  <a href={`https://tiktok.com/@${user.social.tiktok}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaTiktok /> TikTok
                  </a>
                )}
                {user.social?.twitter && (
                  <a href={`https://twitter.com/${user.social.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaTwitter /> X
                  </a>
                )}
                {user.profile?.website && (
                  <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaGlobe /> Website
                  </a>
                )}
                {user.profile?.email && (
                  <a href={`mailto:${user.profile.email}`} className="social-link">
                    <FaEnvelope /> Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="profile-content">
          {user.role === 'creator' && stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalSubmissions}</div>
                <div className="stat-label">Submissions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.winnerSubmissions}</div>
                <div className="stat-label">Wins</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
                <div className="stat-label">Views</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalEarned.toFixed(2)} BNB</div>
                <div className="stat-label">Earned</div>
              </div>
            </div>
          )}

          {isOwnProfile && (
            <div className="card">
              <div className="card-header">
                <h2>Profile Settings</h2>
                <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {isEditing && (
                <div className="profile-edit-form">
                  <p className="empty-text">Profile edit form</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
