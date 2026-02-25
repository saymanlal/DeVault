import React from 'react';

const LockCard = ({ lock }) => {
  return (
    <div className="card">
      <h3>Lock #{lock.id.toString()}</h3>
      <p>Amount: {lock.amount}</p>
    </div>
  );
};

ex
