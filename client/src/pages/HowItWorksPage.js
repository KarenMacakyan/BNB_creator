import React from 'react';
import { Link } from 'react-router-dom';
import { FaWallet, FaRocket, FaUsers, FaDollarSign, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
  return (
    <div className="how-it-works-page">
      <div className="container">
        <div className="page-header">
          <h1>How It Works</h1>
          <p>Simple, transparent, and secure platform for brands and creators</p>
        </div>

        {/* For Brands */}
        <section className="workflow-section">
          <h2 className="workflow-title">For Brands</h2>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-icon"><FaWallet /></div>
              <h3>Connect Wallet</h3>
              <p>Connect your MetaMask wallet and select "Brand" role. Make sure you have BNB for your campaign budget.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-icon"><FaRocket /></div>
              <h3>Create Campaign</h3>
              <p>Set your campaign details: title, description, budget, requirements (platforms, followers, hashtags), and timeline.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-icon"><FaDollarSign /></div>
              <h3>Deposit BNB</h3>
              <p>Your BNB is locked in a smart contract. It's secure and can only be distributed by you or refunded if you close the campaign.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-icon"><FaUsers /></div>
              <h3>Review Submissions</h3>
              <p>Creators submit their TikTok/X content. Review submissions, check engagement metrics, and select winners.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">5</div>
              <div className="step-icon"><FaDollarSign /></div>
              <h3>Pay Winners</h3>
              <p>Initiate payouts to selected creators. Smart contract automatically transfers BNB (minus 1% fee) directly to creator wallets.</p>
            </div>
          </div>
        </section>

        {/* For Creators */}
        <section className="workflow-section">
          <h2 className="workflow-title">For Creators</h2>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-icon"><FaWallet /></div>
              <h3>Connect Wallet</h3>
              <p>Connect your MetaMask wallet and select "Creator" role. No BNB needed to start - you'll earn it!</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-icon"><FaRocket /></div>
              <h3>Browse Campaigns</h3>
              <p>Explore active campaigns, filter by category, budget, and requirements. Find campaigns that match your style and audience.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-icon"><FaUsers /></div>
              <h3>Create Content</h3>
              <p>Produce content on TikTok or X following the campaign guidelines. Use required hashtags and mentions. Be creative!</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-icon"><FaChartLine /></div>
              <h3>Submit Entry</h3>
              <p>Submit your post URL. We'll track views, likes, and engagement. The better your content performs, the higher your chances!</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">5</div>
              <div className="step-icon"><FaDollarSign /></div>
              <h3>Get Paid in BNB</h3>
              <p>If selected, receive instant BNB payment directly to your wallet. No waiting, no intermediaries, just pure earnings!</p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon"><FaShieldAlt /></div>
              <h3>Smart Contract Security</h3>
              <p>All funds are secured by audited smart contracts on Binance Smart Chain. Transparent, immutable, and trustless.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon"><FaDollarSign /></div>
              <h3>Lowest Fees</h3>
              <p>Only 1% platform fee on successful payouts. No hidden charges, no subscription fees. You keep 99% of your earnings.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon"><FaRocket /></div>
              <h3>Instant Payouts</h3>
              <p>Receive BNB payments instantly when brands approve your work. No bank delays, no payment processors.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon"><FaChartLine /></div>
              <h3>Real-time Analytics</h3>
              <p>Track campaign performance, submission metrics, and earnings in real-time. Data-driven decisions for better results.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon"><FaUsers /></div>
              <h3>Global Reach</h3>
              <p>Connect with brands and creators worldwide. No geographical restrictions, just talent and opportunity.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon"><FaWallet /></div>
              <h3>Full Ownership</h3>
              <p>Brands retain full rights to winning content. Creators maintain ownership of their submissions until purchased.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of brands and creators on the platform</p>
          <div className="cta-buttons">
            <Link to="/create-campaign" className="btn btn-primary btn-lg">
              Create Campaign
            </Link>
            <Link to="/explore" className="btn btn-outline btn-lg">
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;

