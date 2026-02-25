// Network configurations
export const NETWORKS = {
    1: {
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      blockExplorer: 'https://etherscan.io',
      chainId: 1,
    },
    11155111: {
      name: 'Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/',
      blockExplorer: 'https://sepolia.etherscan.io',
      chainId: 11155111,
    },
    137: {
      name: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-rpc.com',
      blockExplorer: 'https://polygonscan.com',
      chainId: 137,
    },
    80001: {
      name: 'Mumbai Testnet',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      blockExplorer: 'https://mumbai.polygonscan.com',
      chainId: 80001,
    },
  };
  
  // Default network (Sepolia for development)
  export const DEFAULT_CHAIN_ID = 11155111;
  
  // Time constants
  export const TIME_UNITS = {
    MINUTE: 60,
    HOUR: 3600,
    DAY: 86400,
    WEEK: 604800,
    MONTH: 2592000, // 30 days
    YEAR: 31536000, // 365 days
  };
  
  // Lock duration presets (in seconds)
  export const LOCK_PRESETS = [
    { label: '1 Hour', value: TIME_UNITS.HOUR },
    { label: '1 Day', value: TIME_UNITS.DAY },
    { label: '1 Week', value: TIME_UNITS.WEEK },
    { label: '1 Month', value: TIME_UNITS.MONTH },
    { label: '3 Months', value: TIME_UNITS.MONTH * 3 },
    { label: '6 Months', value: TIME_UNITS.MONTH * 6 },
    { label: '1 Year', value: TIME_UNITS.YEAR },
    { label: '2 Years', value: TIME_UNITS.YEAR * 2 },
  ];
  
  // Token addresses (update with actual deployed addresses)
  export const TOKEN_ADDRESSES = {
    MOCK: '0x0000000000000000000000000000000000000000', // Update after deployment
  };
  
  // Contract events
  export const EVENTS = {
    TOKEN_LOCKED: 'TokensLocked',
    TOKEN_UNLOCKED: 'TokensUnlocked',
    TOKEN_WITHDRAWN: 'TokensWithdrawn',
    EMERGENCY_UNLOCK: 'EmergencyUnlock',
  };
  
  // Status types
  export const LOCK_STATUS = {
    LOCKED: 'locked',
    UNLOCKED: 'unlocked',
    WITHDRAWN: 'withdrawn',
  };
  
  // Error messages
  export const ERROR_MESSAGES = {
    NO_WALLET: 'Please install MetaMask or another Web3 wallet',
    WRONG_NETWORK: 'Please switch to the correct network',
    INSUFFICIENT_BALANCE: 'Insufficient token balance',
    INSUFFICIENT_ALLOWANCE: 'Insufficient token allowance',
    INVALID_AMOUNT: 'Please enter a valid amount',
    INVALID_ADDRESS: 'Please enter a valid address',
    INVALID_DATE: 'Please enter a valid unlock date',
    TRANSACTION_FAILED: 'Transaction failed',
    ALREADY_WITHDRAWN: 'Tokens already withdrawn',
    NOT_UNLOCKED: 'Tokens are still locked',
    NOT_OWNER: 'You are not the owner of this lock',
  };
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    TOKENS_LOCKED: 'Tokens locked successfully!',
    TOKENS_UNLOCKED: 'Tokens unlocked successfully!',
    TOKENS_WITHDRAWN: 'Tokens withdrawn successfully!',
    APPROVAL_SUCCESS: 'Token approval successful!',
  };
  
  // UI constants
  export const UI = {
    REFRESH_INTERVAL: 30000, // 30 seconds
    TRANSACTION_TIMEOUT: 300000, // 5 minutes
    DEBOUNCE_DELAY: 500, // 500ms
    MAX_LOCKS_PER_PAGE: 10,
    ANIMATION_DURATION: 300, // ms
  };
  
  // Regex patterns
  export const PATTERNS = {
    ETH_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
    NUMBER: /^\d+\.?\d*$/,
    INTEGER: /^\d+$/,
  };
  
  // Date formats
  export const DATE_FORMATS = {
    SHORT: 'MMM DD, YYYY',
    LONG: 'MMMM DD, YYYY HH:mm',
    TIME: 'HH:mm:ss',
    ISO: 'YYYY-MM-DDTHH:mm',
  };
  
  // Application info
  export const APP_INFO = {
    NAME: 'DeVault',
    VERSION: '1.0.0',
    DESCRIPTION: 'Decentralized Token Locking Platform',
    GITHUB: 'https://github.com/yourusername/devault',
    DOCS: 'https://docs.devault.io',
  };
  
  // Gas limit estimates
  export const GAS_LIMITS = {
    LOCK: 150000,
    UNLOCK: 100000,
    WITHDRAW: 100000,
    APPROVE: 50000,
  };
  
  export default {
    NETWORKS,
    DEFAULT_CHAIN_ID,
    TIME_UNITS,
    LOCK_PRESETS,
    TOKEN_ADDRESSES,
    EVENTS,
    LOCK_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    UI,
    PATTERNS,
    DATE_FORMATS,
    APP_INFO,
    GAS_LIMITS,
  };