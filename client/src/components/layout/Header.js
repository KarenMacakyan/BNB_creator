import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { useUser } from '../../context/UserContext';
import { FaWallet, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';
import RoleSelectionModal from '../modals/RoleSelectionModal';

const Header = () => {
  const { account, balance, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleConnect = async () => {
    await connectWallet();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const formatBalance = (bal) => {
    return parseFloat(bal).toFixed(4);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">BNB Creator</span>
          </Link>

          <nav className="nav">
            <Link to="/explore" className="nav-link">Campaigns</Link>
            <Link to="/creators" className="nav-link">Creators</Link>
            {user && user.role === 'brand' && (
              <Link to="/create-campaign" className="nav-link">Create Campaign</Link>
            )}
            {user && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
          </nav>

          <div className="header-actions">
            {account ? (
              <div className="wallet-info">
                <div className="balance">
                  {formatBalance(balance)} BNB
                </div>
                <div className="account-dropdown">
                  <button className="account-btn">
                    <FaWallet />
                    {formatAddress(account)}
                  </button>
                  <div className="dropdown-menu">
                    <Link to={`/profile/${account}`} className="dropdown-item">
                      <FaUser /> Profile
                    </Link>
                    {user?.needsRole && (
                      <button 
                        onClick={() => setShowRoleModal(true)} 
                        className="dropdown-item"
                      >
                        Select Role
                      </button>
                    )}
                    <button onClick={disconnectWallet} className="dropdown-item">
                      <FaSignOutAlt /> Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={handleConnect}
                disabled={isConnecting}
              >
                <FaWallet />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>

      {user?.needsRole && (
        <RoleSelectionModal 
          isOpen={showRoleModal || true} 
          onClose={() => setShowRoleModal(false)} 
        />
      )}
    </header>
  );
};

export default Header;

