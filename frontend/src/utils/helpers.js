import { NETWORKS, PATTERNS, ERROR_MESSAGES } from './constants';

/**
 * Get network name from chain ID
 * @param {number} chainId - Chain ID
 * @returns {string} Network name
 */
export const getNetworkName = (chainId) => {
  return NETWORKS[chainId]?.name || 'Unknown Network';
};

/**
 * Get block explorer URL
 * @param {number} chainId - Chain ID
 * @param {string} type - Type (address, tx, block)
 * @param {string} value - Value to link
 * @returns {string} Block explorer URL
 */
export const getBlockExplorerUrl = (chainId, type, value) => {
  const baseUrl = NETWORKS[chainId]?.blockExplorer || 'https://etherscan.io';
  
  switch (type) {
    case 'address':
      return `${baseUrl}/address/${value}`;
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'block':
      return `${baseUrl}/block/${value}`;
    case 'token':
      return `${baseUrl}/token/${value}`;
    default:
      return baseUrl;
  }
};

/**
 * Validate Ethereum address
 * @param {string} address - Address to validate
 * @returns {object} Validation result
 */
export const validateAddress = (address) => {
  if (!address) {
    return { valid: false, error: 'Address is required' };
  }
  
  if (!PATTERNS.ETH_ADDRESS.test(address)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_ADDRESS };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate token amount
 * @param {string} amount - Amount to validate
 * @param {string} balance - User balance
 * @returns {object} Validation result
 */
export const validateAmount = (amount, balance = null) => {
  if (!amount) {
    return { valid: false, error: 'Amount is required' };
  }
  
  if (!PATTERNS.NUMBER.test(amount)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
  }
  
  const numAmount = parseFloat(amount);
  
  if (numAmount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (balance !== null && numAmount > parseFloat(balance)) {
    return { valid: false, error: ERROR_MESSAGES.INSUFFICIENT_BALANCE };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate unlock date
 * @param {Date} date - Date to validate
 * @returns {object} Validation result
 */
export const validateUnlockDate = (date) => {
  if (!date) {
    return { valid: false, error: 'Date is required' };
  }
  
  const now = new Date();
  const unlockDate = new Date(date);
  
  if (unlockDate <= now) {
    return { valid: false, error: 'Unlock date must be in the future' };
  }
  
  // Check if date is too far in the future (e.g., 100 years)
  const maxDate = new Date(now.getTime() + (100 * 365 * 24 * 60 * 60 * 1000));
  if (unlockDate > maxDate) {
    return { valid: false, error: 'Unlock date is too far in the future' };
  }
  
  return { valid: true, error: null };
};

/**
 * Convert Date to Unix timestamp
 * @param {Date} date - Date object
 * @returns {number} Unix timestamp
 */
export const dateToUnixTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

/**
 * Convert Unix timestamp to Date
 * @param {number} timestamp - Unix timestamp
 * @returns {Date} Date object
 */
export const unixTimestampToDate = (timestamp) => {
  return new Date(timestamp * 1000);
};

/**
 * Calculate unlock time from duration
 * @param {number} durationSeconds - Duration in seconds
 * @returns {number} Unix timestamp
 */
export const calculateUnlockTime = (durationSeconds) => {
  const now = Math.floor(Date.now() / 1000);
  return now + durationSeconds;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Sleep function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if user is on mobile
 * @returns {boolean} Is mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Parse error message from contract
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const parseContractError = (error) => {
  if (!error) return 'Unknown error occurred';
  
  const errorString = error.message || error.toString();
  
  // Common error patterns
  if (errorString.includes('user rejected')) {
    return 'Transaction was rejected';
  }
  
  if (errorString.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  if (errorString.includes('nonce too low')) {
    return 'Transaction nonce error. Please try again.';
  }
  
  if (errorString.includes('already withdrawn')) {
    return ERROR_MESSAGES.ALREADY_WITHDRAWN;
  }
  
  if (errorString.includes('not unlocked')) {
    return ERROR_MESSAGES.NOT_UNLOCKED;
  }
  
  if (errorString.includes('not owner')) {
    return ERROR_MESSAGES.NOT_OWNER;
  }
  
  // Extract revert reason if available
  const revertMatch = errorString.match(/reverted with reason string '(.+?)'/);
  if (revertMatch) {
    return revertMatch[1];
  }
  
  const revertCustom = errorString.match(/reverted with custom error '(.+?)'/);
  if (revertCustom) {
    return revertCustom[1];
  }
  
  return 'Transaction failed. Please try again.';
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Sort locks by various criteria
 * @param {Array} locks - Array of locks
 * @param {string} sortBy - Sort criteria
 * @param {string} order - Sort order (asc/desc)
 * @returns {Array} Sorted locks
 */
export const sortLocks = (locks, sortBy = 'unlockTime', order = 'asc') => {
  const sorted = [...locks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'amount':
        comparison = parseFloat(a.amount) - parseFloat(b.amount);
        break;
      case 'unlockTime':
        comparison = a.unlockTime - b.unlockTime;
        break;
      case 'id':
        comparison = a.id - b.id;
        break;
      case 'token':
        comparison = a.tokenInfo.symbol.localeCompare(b.tokenInfo.symbol);
        break;
      default:
        comparison = 0;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

/**
 * Filter locks by search query
 * @param {Array} locks - Array of locks
 * @param {string} query - Search query
 * @returns {Array} Filtered locks
 */
export const filterLocks = (locks, query) => {
  if (!query) return locks;
  
  const lowerQuery = query.toLowerCase();
  
  return locks.filter(lock => {
    return (
      lock.id.toString().includes(lowerQuery) ||
      lock.token.toLowerCase().includes(lowerQuery) ||
      lock.tokenInfo.name.toLowerCase().includes(lowerQuery) ||
      lock.tokenInfo.symbol.toLowerCase().includes(lowerQuery) ||
      lock.beneficiary.toLowerCase().includes(lowerQuery)
    );
  });
};

/**
 * Local storage helper
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

export default {
  getNetworkName,
  getBlockExplorerUrl,
  validateAddress,
  validateAmount,
  validateUnlockDate,
  dateToUnixTimestamp,
  unixTimestampToDate,
  calculateUnlockTime,
  copyToClipboard,
  truncate,
  debounce,
  throttle,
  sleep,
  isMobile,
  parseContractError,
  generateId,
  sortLocks,
  filterLocks,
  storage,
};