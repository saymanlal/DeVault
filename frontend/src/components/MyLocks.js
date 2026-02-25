import React from 'react';
import LockCard from './LockCard';

const MyLocks = ({ locks, account, chainId }) => {
  const { activeLocks, isLoading } = locks;

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
        My Locks 📊
      </h1>

      {activeLocks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
          <h3>No Active Locks</h3>
        </div>
      ) : (
        <div className="grid grid-2">
          {activeLocks.map((lock) => (
            <LockCard
              key={lock.id.toString()}
              lock={lock}
              account={account}
              chainId={chainId}
              onWithdraw={locks.withdraw}
              onEmergencyWithdraw={locks.emergencyWithdraw}
              calculateRewards={locks.calculateRewards}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLocks;
