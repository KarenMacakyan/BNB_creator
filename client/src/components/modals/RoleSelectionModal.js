import React from 'react';
import Modal from 'react-modal';
import { useUser } from '../../context/UserContext';
import { FaBuilding, FaVideo } from 'react-icons/fa';
import './Modal.css';

Modal.setAppElement('#root');

const RoleSelectionModal = ({ isOpen, onClose }) => {
  const { selectRole, loading } = useUser();

  const handleRoleSelect = async (role) => {
    await selectRole(role);
    if (onClose) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2 className="modal-title">Choose Your Role</h2>
        <p className="modal-description">
          Select how you want to use the platform
        </p>

        <div className="role-selection">
          <button
            className="role-card"
            onClick={() => handleRoleSelect('brand')}
            disabled={loading}
          >
            <div className="role-icon brand-icon">
              <FaBuilding />
            </div>
            <h3>Brand</h3>
            <p>Create campaigns and find creators to promote your brand</p>
            <ul className="role-features">
              <li>✓ Create campaigns</li>
              <li>✓ Access creator database</li>
              <li>✓ Results analytics</li>
            </ul>
          </button>

          <button
            className="role-card"
            onClick={() => handleRoleSelect('creator')}
            disabled={loading}
          >
            <div className="role-icon creator-icon">
              <FaVideo />
            </div>
            <h3>Creator</h3>
            <p>Participate in campaigns and earn BNB for your content</p>
            <ul className="role-features">
              <li>✓ Join contests</li>
              <li>✓ Direct BNB payouts</li>
              <li>✓ Work portfolio</li>
            </ul>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RoleSelectionModal;

