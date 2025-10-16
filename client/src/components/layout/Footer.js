import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaTelegram, FaDiscord, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">BNB Creator Platform</h3>
            <p className="footer-description">
              Marketplace connecting brands with TikTok and X content creators, powered by BNB payments
            </p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTelegram />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaDiscord />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/explore">Campaigns</Link></li>
              <li><Link to="/creators">Creators</Link></li>
              <li><Link to="/create-campaign">Create Campaign</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Information</h4>
            <ul className="footer-links">
              <li><Link to="/how-it-works">How it works</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Stats</h4>
            <div className="footer-stats">
              <div className="stat-item">
                <div className="stat-value">1%</div>
                <div className="stat-label">Fee</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">BSC</div>
                <div className="stat-label">Network</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © {currentYear} BNB Creator Platform. All rights reserved.
          </div>
          <div className="footer-links-bottom">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

