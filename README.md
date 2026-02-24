# 🔐 DeVault - Decentralized Token Locking Platform

**DeVault** is a secure, decentralized smart contract vault built on BNB Chain that allows users to lock their ERC20 tokens for specified periods and earn rewards over time. Each user gets their own isolated compartment for maximum security and personalized reward management.

![BNB Chain](https://img.shields.io/badge/BNB%20Chain-Testnet-yellow)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-2.19.0-yellow)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 What is DeVault?

DeVault is your personal decentralized safe deposit box on the blockchain. Lock your tokens, earn rewards, and maintain complete control - all through an intuitive web interface.

### Why DeVault?

- **🔒 Secure by Design**: Battle-tested OpenZeppelin contracts with reentrancy protection
- **👤 Personal Compartments**: Your tokens, your space - isolated from everyone else
- **💰 Reward Earning**: Earn APY-based rewards just for locking your tokens
- **⏱️ Flexible Locking**: Choose your own lock duration (1 day to 365 days)
- **🚀 Easy to Use**: Simple, clean interface - no blockchain expertise needed
- **🛡️ Audited Patterns**: Industry-standard security practices

---

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Smart Contract](#smart-contract)
- [Installation](#installation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Frontend Setup](#frontend-setup)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Smart Contract Features

✅ **Token Locking Mechanism**
- Lock any ERC20 token for customizable durations
- Minimum lock: 1 day | Maximum lock: 365 days
- Support for multiple simultaneous locks

✅ **Reward Calculation**
- APY-based reward system (default: 10% APY)
- Real-time reward calculations
- View rewards anytime without claiming

✅ **Individual Compartments**
- Each user has isolated storage
- No cross-user interference
- Personal balance tracking per token

✅ **Security Measures**
- Owner-only access controls
- Reentrancy protection
- Pausable in emergencies
- Safe token transfers
- Input validation

✅ **Advanced Features**
- Emergency withdrawal (with penalty)
- Multiple locks per user
- Lock history tracking
- Admin controls for parameters

### Frontend Features

🎨 **Modern UI/UX**
- Clean, responsive design
- Dark mode support
- Mobile-friendly interface
- Real-time updates

🔌 **Web3 Integration**
- MetaMask wallet connection
- Network detection
- Transaction status tracking
- Error handling

📊 **Dashboard**
- Total locked tokens
- Total rewards earned
- Active locks count
- Lock history

🔐 **Lock Management**
- Easy token locking interface
- Duration selector
- Amount input with validation
- Approval handling

💼 **Compartment View**
- All your locks in one place
- Countdown timers
- Reward calculations
- Withdraw buttons

---

## 🎬 Demo

### Live Demo
🔗 [https://devault-demo.vercel.app](https://devault-demo.vercel.app)

### Video Walkthrough
📹 [Watch on YouTube](https://youtube.com/watch?v=demo)

### Screenshots

**Dashboard View**
```
┌─────────────────────────────────────────┐
│  💼 My DeVault Dashboard                │
├─────────────────────────────────────────┤
│  Total Locked: 1,000 TEST               │
│  Total Rewards: 25.5 TEST               │
│  Active Locks: 3                        │
└─────────────────────────────────────────┘
```

**Lock Interface**
```
┌─────────────────────────────────────────┐
│  🔒 Lock Tokens                         │
├─────────────────────────────────────────┤
│  Token: [TEST Token ▼]                  │
│  Amount: [_________] TEST               │
│  Duration: [30 days ▼]                  │
│  APY: 10%                               │
│                                         │
│  [ Lock Tokens ]                        │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/DeVault.git
cd DeVault

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your details

# 4. Compile contracts
npx hardhat compile

# 5. Run tests
npx hardhat test

# 6. Deploy to testnet
npx hardhat run scripts/deploy.js --network bscTestnet

# 7. Start frontend
cd frontend
npm install
npm start
```

🎉 **That's it!** Your DeVault instance is running!

---

## 📁 Project Structure

```
DeVault/
├── 📄 README.md                    # You are here
├── 📄 LICENSE                      # MIT License
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env.example                 # Environment template
├── 📄 hardhat.config.js            # Hardhat configuration
├── 📄 package.json                 # Project dependencies
│
├── 📁 contracts/                   # Smart contracts
│   ├── DeVault.sol                 # Main vault contract
│   └── MockToken.sol               # Test ERC20 token
│
├── 📁 scripts/                     # Deployment scripts
│   ├── deploy.js                   # Main deployment
│   ├── verify.js                   # Contract verification
│   └── interact.js                 # Interaction examples
│
├── 📁 test/                        # Test suite
│   ├── DeVault.test.js             # Main tests
│   └── helpers.js                  # Test utilities
│
└── 📁 frontend/                    # React frontend
    ├── 📄 package.json             # Frontend dependencies
    ├── 📁 public/                  # Static assets
    │   ├── index.html
    │   ├── favicon.ico
    │   └── logo.png
    │
    └── 📁 src/
        ├── 📄 App.js               # Main component
        ├── 📄 index.js             # Entry point
        ├── 📄 index.css            # Global styles
        │
        ├── 📁 components/          # React components
        │   ├── Navbar.js           # Navigation bar
        │   ├── Dashboard.js        # User dashboard
        │   ├── LockTokens.js       # Lock interface
        │   ├── MyLocks.js          # Locks display
        │   ├── LockCard.js         # Single lock card
        │   └── Footer.js           # Footer
        │
        ├── 📁 contracts/           # Contract artifacts
        │   ├── DeVault.json        # Contract ABI
        │   ├── MockToken.json      # Token ABI
        │   └── addresses.json      # Deployed addresses
        │
        ├── 📁 hooks/               # Custom React hooks
        │   ├── useWeb3.js          # Web3 provider hook
        │   ├── useContract.js      # Contract interaction
        │   └── useLocks.js         # Lock management
        │
        └── 📁 utils/               # Utility functions
            ├── constants.js        # App constants
            ├── formatters.js       # Data formatters
            └── helpers.js          # Helper functions
```

---

## 🔧 Smart Contract

### DeVault.sol

The main smart contract with individual user compartments and reward calculation.

#### Key Functions

**User Functions**
```solidity
// Lock tokens for rewards
lockTokens(address token, uint256 amount, uint256 duration)

// Withdraw after lock expires
withdraw(uint256 lockId)

// Emergency withdraw (with penalty)
emergencyWithdraw(uint256 lockId)

// Calculate current rewards
calculateRewards(address user, uint256 lockId)

// Get all user locks
getUserLocks(address user)

// Get active locks only
getActiveLocks(address user)

// Get total rewards
getTotalRewards(address user)
```

**Owner Functions**
```solidity
// Update reward rate
setRewardRate(uint256 newRate)

// Update lock durations
setLockDuration(uint256 min, uint256 max)

// Update penalty
setEarlyWithdrawalPenalty(uint256 penalty)

// Emergency pause
pause() / unpause()

// Recover stuck tokens
recoverERC20(address token, uint256 amount)
```

#### Contract Parameters

| Parameter | Default Value | Description |
|-----------|---------------|-------------|
| Reward Rate | 1000 (10%) | Annual percentage yield |
| Min Lock Duration | 86400 (1 day) | Minimum lock time |
| Max Lock Duration | 31536000 (365 days) | Maximum lock time |
| Early Withdrawal Penalty | 500 (5%) | Penalty for early exit |

#### Security Features

- ✅ **ReentrancyGuard**: Prevents reentrancy attacks
- ✅ **Ownable**: Owner-only admin functions
- ✅ **Pausable**: Emergency pause capability
- ✅ **SafeERC20**: Safe token transfers
- ✅ **Access Control**: User-only compartment access
- ✅ **Input Validation**: All inputs validated
- ✅ **Event Logging**: Complete audit trail

---

## 💻 Installation

### Prerequisites

Ensure you have these installed:

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** ([Download](https://git-scm.com/))
- **MetaMask** ([Install](https://metamask.io/))

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/DeVault.git
cd DeVault
```

### Step 2: Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# BNB Chain RPC URLs
BSCTESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
BSCMAINNET_RPC_URL=https://bsc-dataseed.binance.org

# Your wallet private key (NEVER share this!)
PRIVATE_KEY=your_private_key_here

# BscScan API Key (get from https://bscscan.com/myapikey)
BSCSCAN_API_KEY=your_api_key_here

# Contract Parameters
REWARD_RATE=1000                    # 10% APY
MIN_LOCK_DURATION=86400             # 1 day
MAX_LOCK_DURATION=31536000          # 365 days
EARLY_WITHDRAWAL_PENALTY=500        # 5%
```

### Step 4: Get Testnet BNB

Get free testnet BNB from the faucet:
🔗 https://testnet.bnbchain.org/faucet-smart

---

## 🧪 Testing

### Run All Tests

```bash
npx hardhat test
```

### Run with Coverage

```bash
npx hardhat coverage
```

### Run with Gas Report

```bash
REPORT_GAS=true npx hardhat test
```

### Test Suite Coverage

Our comprehensive test suite includes:

✅ **Deployment Tests**
- Constructor parameters
- Initial state
- Owner setup

✅ **Token Locking Tests**
- Successful locking
- Multiple locks
- Input validation
- Edge cases

✅ **Reward Calculation Tests**
- Accurate calculations
- Time-based rewards
- Multiple locks
- Edge cases

✅ **Withdrawal Tests**
- Normal withdrawal
- Emergency withdrawal
- Penalties
- Access control

✅ **Security Tests**
- Reentrancy protection
- Access control
- Pause functionality
- Edge cases

✅ **Admin Functions Tests**
- Parameter updates
- Emergency functions
- Token recovery

### Sample Test Output

```
  DeVault Contract
    Deployment
      ✓ Should set correct owner
      ✓ Should set correct reward rate
      ✓ Should set correct lock durations
      ✓ Should revert invalid parameters
    
    Token Locking
      ✓ Should allow users to lock tokens
      ✓ Should transfer tokens to contract
      ✓ Should create user compartment
      ✓ Should allow multiple locks
      ✓ Should revert invalid inputs
    
    Reward Calculation
      ✓ Should calculate rewards correctly
      ✓ Should handle partial time periods
      ✓ Should handle multiple locks
    
    Withdrawals
      ✓ Should allow withdrawal after unlock
      ✓ Should transfer tokens and rewards
      ✓ Should prevent double withdrawal
      ✓ Should handle emergency withdrawal
      ✓ Should apply penalty correctly

  72 passing (8s)
```

---

## 🚀 Deployment

### Deploy to BNB Testnet

```bash
# Compile contracts
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.js --network bscTestnet

# Verify on BscScan
npx hardhat run scripts/verify.js --network bscTestnet
```

### Deploy to BNB Mainnet

```bash
# ⚠️ WARNING: Use with caution on mainnet!

# Deploy
npx hardhat run scripts/deploy.js --network bscMainnet

# Verify
npx hardhat run scripts/verify.js --network bscMainnet
```

### Deployment Checklist

Before deploying to mainnet:

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Parameters reviewed
- [ ] Sufficient BNB for gas
- [ ] Private key secured
- [ ] Backup plan ready
- [ ] Team notified
- [ ] Documentation updated

### Post-Deployment

After successful deployment:

1. **Save Addresses**: Contract addresses saved to `frontend/src/contracts/addresses.json`
2. **Verify Contract**: Run verification script
3. **Update Frontend**: Update contract addresses in frontend
4. **Test Integration**: Test frontend with deployed contract
5. **Monitor**: Watch for any issues
6. **Announce**: Share with community

---

## 💻 Frontend Setup

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Configure Contract Addresses

Update `frontend/src/contracts/addresses.json`:

```json
{
  "bscTestnet": {
    "DeVault": "0x...",
    "MockToken": "0x..."
  },
  "bscMainnet": {
    "DeVault": "0x..."
  }
}
```

### Run Development Server

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Optimized build created in `build/` directory.

### Deploy Frontend

#### Option 1: Vercel

```bash
npm install -g vercel
vercel
```

#### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

#### Option 3: IPFS (Decentralized)

```bash
npm run build
ipfs add -r build/
```

---

## 📖 Usage Guide

### For End Users

#### 1. Connect Wallet

1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Ensure you're on BNB Chain Testnet

#### 2. Lock Tokens

1. Go to "Lock Tokens" section
2. Select token to lock
3. Enter amount (must have sufficient balance)
4. Choose lock duration (1-365 days)
5. Click "Approve" (one-time per token)
6. Click "Lock Tokens"
7. Confirm transaction in MetaMask
8. Wait for confirmation

#### 3. View Your Locks

1. Navigate to "My Locks" section
2. See all active locks
3. View:
   - Locked amount
   - Lock duration
   - Unlock time
   - Current rewards
   - Status

#### 4. Withdraw Tokens

**Normal Withdrawal** (after unlock time):
1. Find the lock in "My Locks"
2. Click "Withdraw" button
3. Confirm transaction
4. Receive tokens + rewards

**Emergency Withdrawal** (before unlock time):
1. Find the lock in "My Locks"
2. Click "Emergency Withdraw"
3. Confirm penalty (5% default)
4. Confirm transaction
5. Receive tokens (minus penalty)

### For Developers

#### Integrate DeVault

```javascript
import { ethers } from 'ethers';
import DeVaultABI from './contracts/DeVault.json';

// Connect to contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const deVault = new ethers.Contract(
  DEVAULT_ADDRESS,
  DeVaultABI,
  signer
);

// Lock tokens
const token = "0x..."; // Token address
const amount = ethers.utils.parseEther("100");
const duration = 30 * 86400; // 30 days

await deVault.lockTokens(token, amount, duration);

// Get user locks
const locks = await deVault.getUserLocks(userAddress);

// Calculate rewards
const rewards = await deVault.calculateRewards(userAddress, lockId);

// Withdraw
await deVault.withdraw(lockId);
```

---

## 📚 API Reference

### Smart Contract Functions

#### `lockTokens(address token, uint256 amount, uint256 duration)`
Lock tokens for specified duration.

**Parameters:**
- `token`: ERC20 token address
- `amount`: Amount to lock (in wei)
- `duration`: Lock duration in seconds

**Returns:** `uint256 lockId`

**Events:** `TokensLocked`

---

#### `withdraw(uint256 lockId)`
Withdraw tokens after lock expires.

**Parameters:**
- `lockId`: ID of lock to withdraw

**Events:** `TokensWithdrawn`

---

#### `calculateRewards(address user, uint256 lockId)`
Calculate current rewards for a lock.

**Parameters:**
- `user`: User address
- `lockId`: Lock ID

**Returns:** `uint256 rewards`

---

#### `getUserLocks(address user)`
Get all locks for a user.

**Parameters:**
- `user`: User address

**Returns:** `Lock[] memory`

---

## 🔒 Security

### Audit Status

🔍 **Status**: Not yet audited  
🎯 **Target**: Q2 2024

### Security Measures

✅ **Smart Contract**
- OpenZeppelin contracts (v5.0.0)
- Reentrancy protection
- Integer overflow protection (Solidity 0.8+)
- Access control
- Pausable functionality
- Safe token transfers
- Input validation
- Event logging

✅ **Frontend**
- No private key storage
- Secure Web3 integration
- Input sanitization
- Error handling
- Network validation

### Best Practices

1. **Never share your private key**
2. **Always verify contract addresses**
3. **Start with small amounts**
4. **Use testnet first**
5. **Keep MetaMask updated**
6. **Backup your seed phrase**

### Bug Bounty

We value security. Found a vulnerability?

📧 Email: security@devault.io  
💰 Rewards: Up to $10,000

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Getting Started

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Write clean, documented code
- Add tests for new features
- Follow existing code style
- Update documentation
- Create meaningful commits

### Areas to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation
- 🧪 Test coverage
- 🎨 UI/UX improvements
- 🌍 Translations

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 DeVault Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full license text...]
```

---

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **Hardhat** for development framework
- **BNB Chain** for blockchain infrastructure
- **React** for frontend framework
- **Ethers.js** for Web3 integration
- **Community** for feedback and support

---

## 📞 Support & Community

### Get Help

- 📖 **Documentation**: [docs.devault.io](https://docs.devault.io)
- 💬 **Discord**: [Join our server](https://discord.gg/devault)
- 🐦 **Twitter**: [@DeVaultDeFi](https://twitter.com/DeVaultDeFi)
- 📧 **Email**: support@devault.io

### Report Issues

Found a bug? Have a suggestion?

🔗 [GitHub Issues](https://github.com/yourusername/DeVault/issues)

### Stay Updated

- ⭐ Star this repo
- 👀 Watch for updates
- 🔔 Follow us on social media

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Smart contract development
- [x] Security implementation
- [x] Frontend development
- [x] Testnet deployment
- [x] Documentation

### Phase 2: Enhancement (Q2 2024)
- [ ] Professional security audit
- [ ] Mainnet deployment
- [ ] Multi-token support
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 3: Expansion (Q3 2024)
- [ ] Multi-chain deployment
- [ ] Governance features
- [ ] NFT lock receipts
- [ ] Auto-compounding
- [ ] Referral system

### Phase 4: Scale (Q4 2024)
- [ ] Institutional features
- [ ] API for integrations
- [ ] White-label solution
- [ ] DAO governance

---

## ⚠️ Disclaimer

**Important**: This software is provided "as is", without warranty of any kind. Use at your own risk.

- ⚠️ Smart contracts are experimental technology
- ⚠️ Only invest what you can afford to lose
- ⚠️ Always DYOR (Do Your Own Research)
- ⚠️ Not financial advice
- ⚠️ Not audited (yet)

---

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/DeVault?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/DeVault?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/DeVault)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/DeVault)

---

<div align="center">

### Built with ❤️ for the DeFi community

**DeVault** - Your Decentralized Safe Deposit Box

[Website](https://devault.io) • [Documentation](https://docs.devault.io) • [Twitter](https://twitter.com/DeVaultDeFi) • [Discord](https://discord.gg/devault)

</div>
