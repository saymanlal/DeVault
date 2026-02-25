import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';

const LockTokens = () => {
  const [amount, setAmount] = useState('');

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        Lock Tokens
      </h1>

      <div className="card" style={{ maxWidth: '500px' }}>
        <label className="label">Amount</label>
        <input
          type="number"
          className="input"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          className="btn btn-success"
          style={{ marginTop: '20px', width: '100%' }}
        >
          <FaLock /> Lock Tokens
        </button>
      </div>
    </div>
  );
};

export default LockTokens;
