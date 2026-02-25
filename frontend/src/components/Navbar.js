import React from 'react';
import { FaLock, FaList, FaChartLine, FaWallet } from 'react-icons/fa';

const Navbar = ({ web3, activeTab, setActiveTab }) => {
  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      padding: '16px 0',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 800,
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <FaLock />
          DeVault
        </div>

        {web3?.isConnected && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>
              <FaChartLine /> Dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('lock')}>
              <FaLock /> Lock
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('mylocks')}>
              <FaList /> My Locks
            </button>
          </div>
        )}

        {web3?.isConnected ? (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '8px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaWallet />
            {web3.account?.slice(0,6)}...{web3.account?.slice(-4)}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={web3?.connect}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
