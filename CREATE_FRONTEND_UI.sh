#!/bin/bash

set -e

echo "🎭 Creating UI Components..."
echo ""

cd ~/Downloads/DeVault
mkdir -p frontend/src/components

# ==============================
# NAVBAR
# ==============================

echo "📌 Creating Navbar..."
cat > frontend/src/components/Navbar.js << 'ENDNAV'
import React from 'react';
import { FaLock, FaList, FaChartLine, FaWallet } from 'react-icons/fa';

const Navbar = ({ web3, activeTab, setActiveTab }) => {
  return (
    <nav style={{ padding: '16px 0', borderBottom: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 800 }}>
          <FaLock /> DeVault
        </div>

        {web3?.isConnected && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setActiveTab('dashboard')}> <FaChartLine /> Dashboard </button>
            <button onClick={() => setActiveTab('lock')}> <FaLock /> Lock </button>
            <button onClick={() => setActiveTab('mylocks')}> <FaList /> My Locks </button>
          </div>
        )}

        {web3?.isConnected ? (
          <div>
            <FaWallet /> {web3.account?.slice(0,6)}...{web3.account?.slice(-4)}
          </div>
        ) : (
          <button onClick={web3?.connect}>Connect Wallet</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
ENDNAV

# ==============================
# DASHBOARD
# ==============================

echo "📊 Creating Dashboard..."
cat > frontend/src/components/Dashboard.js << 'ENDDASH'
import React from 'react';

const Dashboard = ({ locks }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Locked: {locks?.totalLocked || 0}</p>
      <p>Active Locks: {locks?.activeLocks?.length || 0}</p>
    </div>
  );
};

export default Dashboard;
ENDDASH

# ==============================
# LOCK TOKENS
# ==============================

echo "🔒 Creating LockTokens..."
cat > frontend/src/components/LockTokens.js << 'ENDLOCK'
import React, { useState } from 'react';

const LockTokens = () => {
  const [amount, setAmount] = useState('');

  return (
    <div>
      <h1>Lock Tokens</h1>
      <input
        type="number"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button>Lock Tokens</button>
    </div>
  );
};

export default LockTokens;
ENDLOCK

# ==============================
# MY LOCKS
# ==============================

echo "📋 Creating MyLocks..."
cat > frontend/src/components/MyLocks.js << 'ENDMYLOCKS'
import React from 'react';
import LockCard from './LockCard';

const MyLocks = ({ locks }) => {
  const { activeLocks = [], isLoading } = locks || {};

  if (isLoading) return <div>Loading...</div>;

  if (activeLocks.length === 0) {
    return <div>No Active Locks</div>;
  }

  return (
    <div>
      <h1>My Locks</h1>
      {activeLocks.map((lock) => (
        <LockCard key={lock.id.toString()} lock={lock} />
      ))}
    </div>
  );
};

export default MyLocks;
ENDMYLOCKS

# ==============================
# LOCK CARD
# ==============================

echo "🎴 Creating LockCard..."
cat > frontend/src/components/LockCard.js << 'ENDCARD'
import React from 'react';

const LockCard = ({ lock }) => {
  return (
    <div style={{ border: '1px solid #333', padding: '10px', margin: '10px 0' }}>
      <h3>Lock #{lock.id.toString()}</h3>
      <p>Amount: {lock.amount}</p>
    </div>
  );
};

export default LockCard;
ENDCARD

# ==============================
# FOOTER
# ==============================

echo "🦶 Creating Footer..."
cat > frontend/src/components/Footer.js << 'ENDFOOTER'
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #222' }}>
      DeVault © 2026
    </footer>
  );
};

export default Footer;
ENDFOOTER

echo ""
echo "✅ All UI components created successfully!"
echo ""

