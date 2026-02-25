import { ethers } from 'ethers';

/**
 * Format Ethereum address to shortened version
 * @param {string} address - Full Ethereum address
 * @param {number} startChars - Number of chars to show at start
 * @param {number} endChars - Number of chars to show at end
 * @returns {string} Formatted address
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format token amount with proper decimals
 * @param {string|number} amount - Token amount
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted amount
 */
export const formatTokenAmount = (amount, decimals = 4) => {
  if (!amount || amount === '0') return '0';
  
  const num = parseFloat(amount);
  
  // For very small numbers, use scientific notation
  if (num < 0.0001 && num > 0) {
    return num.toExponential(2);
  }
  
  // For large numbers, add commas
  if (num >= 1000000) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date
 */
export const formatDate = (timestamp, includeTime = true) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleString('en-US', options);
};

/**
 * Format time remaining until unlock
 * @param {number} unlockTime - Unix timestamp of unlock time
 * @returns {string} Human readable time remaining
 */
export const formatTimeRemaining = (unlockTime) => {
  const now = Math.floor(Date.now() / 1000);
  const remaining = unlockTime - now;
  
  if (remaining <= 0) {
    return 'Unlocked';
  }
  
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    return `${years}y ${remainingDays}d`;
  }
  
  if (days > 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months}mo ${remainingDays}d`;
  }
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  
  return `${seconds}s`;
};

/**
 * Format USD value
 * @param {number} value - USD value
 * @returns {string} Formatted USD value
 */
export const formatUSD = (value) => {
  if (!value || value === 0) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (!value && value !== 0) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format transaction hash
 * @param {string} hash - Transaction hash
 * @returns {string} Shortened hash
 */
export const formatTxHash = (hash) => {
  if (!hash) return '';
  return formatAddress(hash, 10, 8);
};

/**
 * Format wei to ether
 * @param {string|BigNumber} wei - Wei amount
 * @returns {string} Ether amount
 */
export const formatWeiToEther = (wei) => {
  if (!wei) return '0';
  try {
    return ethers.formatEther(wei);
  } catch (err) {
    console.error('Error formatting wei:', err);
    return '0';
  }
};

/**
 * Format ether to wei
 * @param {string|number} ether - Ether amount
 * @returns {BigNumber} Wei amount
 */
export const formatEtherToWei = (ether) => {
  if (!ether) return ethers.parseEther('0');
  try {
    return ethers.parseEther(ether.toString());
  } catch (err) {
    console.error('Error formatting ether:', err);
    return ethers.parseEther('0');
  }
};

/**
 * Format large numbers with suffixes (K, M, B)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatLargeNumber = (num) => {
  if (!num || num === 0) return '0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  }
  if (absNum >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  if (absNum >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  
  return num.toFixed(2);
};

/**
 * Format duration in seconds to human readable
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0 seconds';
  
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor((seconds % 31536000) / 2592000);
  const days = Math.floor((seconds % 2592000) / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (secs > 0) parts.push(`${secs} second${secs > 1 ? 's' : ''}`);
  
  return parts.slice(0, 2).join(' ');
};

/**
 * Validate Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} Is valid address
 */
export const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Validate number input
 * @param {string} value - Value to validate
 * @returns {boolean} Is valid number
 */
export const isValidNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
};

/**
 * Get time ago string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Time ago string
 */
export const getTimeAgo = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  
  return `${Math.floor(diff / 31536000)} years ago`;
};

export default {
  formatAddress,
  formatTokenAmount,
  formatDate,
  formatTimeRemaining,
  formatUSD,
  formatPercentage,
  formatTxHash,
  formatWeiToEther,
  formatEtherToWei,
  formatLargeNumber,
  formatDuration,
  isValidAddress,
  isValidNumber,
  getTimeAgo,
};