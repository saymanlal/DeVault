import React from 'react';

const Dashboard = ({ locks }) => {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        Dashboard
      </h1>

      <div className="grid grid-2">
        <div className="card">
          <h3>Total Locked</h3>
          <p style={{ fontSize: '22px', fontWeight: 700 }}>
            {locks?.totalLocked || 0}
          </p>
        </div>

        <div className="card">
          <h3>Active Locks</h3>
          <p style={{ fontSize: '22px', fontWeight: 700 }}>
            {locks?.activeLocks?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
