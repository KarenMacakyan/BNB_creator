import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaRocket, FaUsers, FaChartLine, FaBolt } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalCreators: 0,
    totalViews: 0,
    totalBudget: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/platform');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title fade-in">
                Creator Platform with BNB Payments
              </h1>
              <p className="hero-description fade-in">
                Brands launch campaigns, creators produce viral content on TikTok and X, 
                get paid directly to their wallet. Only 1% fee.
              </p>
              <div className="hero-actions fade-in">
                <Link to="/explore" className="btn btn-primary btn-lg">
                  <FaRocket /> Get Started
                </Link>
                <Link to="/creators" className="btn btn-outline btn-lg">
                  <FaUsers /> Creators
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="floating-card">
                <div className="card-icon">⚡</div>
                <div className="card-title">1% fee</div>
                <div className="card-desc">Minimal costs</div>
              </div>
              <div className="floating-card delay-1">
                <div className="card-icon">🚀</div>
                <div className="card-title">Direct payouts</div>
                <div className="card-desc">No intermediaries</div>
              </div>
              <div className="floating-card delay-2">
                <div className="card-icon">💰</div>
                <div className="card-title">BNB payments</div>
                <div className="card-desc">Fast and secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaRocket />
              </div>
              <div className="stat-value">{formatNumber(stats.totalCampaigns)}</div>
              <div className="stat-label">Campaigns</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-value">{formatNumber(stats.totalCreators)}</div>
              <div className="stat-label">Creators</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-value">{formatNumber(stats.totalViews)}</div>
              <div className="stat-label">Views</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaBolt />
              </div>
              <div className="stat-value">{stats.totalBudget.toFixed(0)} BNB</div>
              <div className="stat-label">Total Budget</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💸</div>
              <h3>Low Fee</h3>
              <p>Only 1% transaction fee — the lowest in the market</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Payouts</h3>
              <p>Direct BNB transfers to creator wallets without delays</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Targeted Audience</h3>
              <p>Find creators with the right audience for your brand</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track metrics and results in real-time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Contest System</h3>
              <p>Creators compete for prizes, creating the best content</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Security</h3>
              <p>Smart contracts guarantee transparency and security</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Campaign</h3>
              <p>Describe your task, allocate budget in BNB</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Creators Participate</h3>
              <p>Creators produce content on TikTok/X</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Choose Winners</h3>
              <p>Review results and select the best work</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Automatic Payouts</h3>
              <p>BNB transferred directly to winners</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start?</h2>
            <p>Join thousands of brands and creators</p>
            <Link to="/explore" className="btn btn-primary btn-lg">
              Explore Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
