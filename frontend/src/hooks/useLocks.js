import { useState, useEffect, useCallback } from 'react';

const useLocks = (account, contractMethods) => {
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all locks for the user
  const fetchLocks = useCallback(async () => {
    if (!account || !contractMethods.getUserLocks) {
      setLocks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get lock IDs
      const lockIds = await contractMethods.getUserLocks(account);
      
      if (lockIds.length === 0) {
        setLocks([]);
        setLoading(false);
        return;
      }

      // Fetch details for each lock
      const lockDetailsPromises = lockIds.map(async (lockId) => {
        const details = await contractMethods.getLockDetails(lockId);
        return {
          id: lockId,
          ...details,
        };
      });

      const lockDetails = await Promise.all(lockDetailsPromises);
      
      // Fetch token info for each unique token
      const tokenInfoCache = {};
      const locksWithTokenInfo = await Promise.all(
        lockDetails.map(async (lock) => {
          if (!tokenInfoCache[lock.token]) {
            tokenInfoCache[lock.token] = await contractMethods.getTokenInfo(lock.token);
          }
          
          return {
            ...lock,
            tokenInfo: tokenInfoCache[lock.token],
          };
        })
      );

      setLocks(locksWithTokenInfo);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching locks:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [account, contractMethods]);

  // Refresh locks on account change
  useEffect(() => {
    fetchLocks();
  }, [fetchLocks]);

  // Filter locks by status
  const getActiveLocks = () => {
    return locks.filter(lock => !lock.withdrawn);
  };

  const getUnlockedLocks = () => {
    const now = Math.floor(Date.now() / 1000);
    return locks.filter(lock => !lock.withdrawn && lock.unlockTime <= now);
  };

  const getLockedLocks = () => {
    const now = Math.floor(Date.now() / 1000);
    return locks.filter(lock => !lock.withdrawn && lock.unlockTime > now);
  };

  const getWithdrawnLocks = () => {
    return locks.filter(lock => lock.withdrawn);
  };

  // Check if a lock is unlockable
  const isUnlockable = (lock) => {
    const now = Math.floor(Date.now() / 1000);
    return !lock.withdrawn && lock.unlockTime <= now;
  };

  // Get time remaining for a lock
  const getTimeRemaining = (unlockTime) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = unlockTime - now;
    
    if (remaining <= 0) {
      return 'Unlocked';
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Get lock statistics
  const getStats = () => {
    const active = getActiveLocks();
    const totalValue = active.reduce((sum, lock) => {
      return sum + parseFloat(lock.amount);
    }, 0);

    return {
      totalLocks: locks.length,
      activeLocks: active.length,
      unlockedLocks: getUnlockedLocks().length,
      withdrawnLocks: getWithdrawnLocks().length,
      totalValue: totalValue.toFixed(2),
    };
  };

  return {
    locks,
    loading,
    error,
    fetchLocks,
    getActiveLocks,
    getUnlockedLocks,
    getLockedLocks,
    getWithdrawnLocks,
    isUnlockable,
    getTimeRemaining,
    getStats,
  };
};

export default useLocks;