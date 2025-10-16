import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaRocket, FaStar, FaCrown } from 'react-icons/fa';
import './PricingPage.css';

const PricingPage = () => {
  return (
    <div className="pricing-page">
      <div className="container">
        <div className="page-header">
          <h1>Pricing</h1>
          <p>Simple and transparent pricing. Only pay for what you use.</p>
        </div>

        <div className="pricing-grid">
          {/* Free Tier */}
          <div className="pricing-card">
            <div className="pricing-icon">
              <FaRocket />
            </div>
            <h3 className="pricing-title">Free</h3>
            <div className="pricing-price">
              <span className="price-amount">$0</span>
              <span className="price-period">/month</span>
            </div>
            <p className="pricing-description">Perfect for getting started</p>
            <ul className="pricing-features">
              <li><FaCheck /> Browse all campaigns</li>
              <li><FaCheck /> Submit to campaigns</li>
              <li><FaCheck /> Basic analytics</li>
              <li><FaCheck /> Community support</li>
              <li><FaCheck /> 1% platform fee</li>
            </ul>
            <Link to="/explore" className="btn btn-outline btn-lg">
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="pricing-card featured">
            <div className="featured-badge">Most Popular</div>
            <div className="pricing-icon">
              <FaStar />
            </div>
            <h3 className="pricing-title">Pro</h3>
            <div className="pricing-price">
              <span className="price-amount">0.5%</span>
              <span className="price-period">fee only</span>
            </div>
            <p className="pricing-description">For professional creators</p>
            <ul className="pricing-features">
              <li><FaCheck /> Everything in Free</li>
              <li><FaCheck /> <strong>Only 0.5% platform fee</strong></li>
              <li><FaCheck /> Priority support</li>
              <li><FaCheck /> Advanced analytics</li>
              <li><FaCheck /> Featured in creator list</li>
              <li><FaCheck /> Custom profile badge</li>
              <li><FaCheck /> Early access to campaigns</li>
            </ul>
            <Link to="/explore" className="btn btn-primary btn-lg">
              Upgrade to Pro
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="pricing-card">
            <div className="pricing-icon">
              <FaCrown />
            </div>
            <h3 className="pricing-title">Enterprise</h3>
            <div className="pricing-price">
              <span className="price-amount">Custom</span>
            </div>
            <p className="pricing-description">For large brands and agencies</p>
            <ul className="pricing-features">
              <li><FaCheck /> Everything in Pro</li>
              <li><FaCheck /> White-label solution</li>
              <li><FaCheck /> Custom fee structure</li>
              <li><FaCheck /> Dedicated account manager</li>
              <li><FaCheck /> API access</li>
              <li><FaCheck /> Custom integrations</li>
              <li><FaCheck /> SLA guarantee</li>
            </ul>
            <a href="#contact" className="btn btn-outline btn-lg">
              Contact Sales
            </a>
          </div>
        </div>

        {/* Platform Fees Section */}
        <div className="fees-section">
          <h2>Platform Fees</h2>
          <div className="fees-grid">
            <div className="fee-card">
              <h3>Standard Fee</h3>
              <div className="fee-value">1%</div>
              <p>Lowest fee in the market. Only charged on successful payouts.</p>
            </div>
            <div className="fee-card">
              <h3>Pro Creator Fee</h3>
              <div className="fee-value">0.5%</div>
              <p>50% discount for verified professional creators.</p>
            </div>
            <div className="fee-card">
              <h3>Withdrawal Fee</h3>
              <div className="fee-value">0 BNB</div>
              <p>No withdrawal fees. Keep all your earnings.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>When do I pay the platform fee?</h4>
              <p>The platform fee is automatically deducted when a payout is made from the smart contract. Brands deposit the full amount, and creators receive their payment minus the 1% fee.</p>
            </div>
            <div className="faq-item">
              <h4>Can I cancel my Pro subscription?</h4>
              <p>Yes, you can cancel anytime. You'll continue to have Pro benefits until the end of your billing period.</p>
            </div>
            <div className="faq-item">
              <h4>Are there any hidden fees?</h4>
              <p>No hidden fees. The only cost is the transparent platform fee and standard BSC network gas fees for blockchain transactions.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>All payments are made in BNB (Binance Coin) through your connected wallet. This ensures instant, secure, and transparent transactions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

