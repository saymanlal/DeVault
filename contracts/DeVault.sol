// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title DeVault
 * @author DeVault Team
 * @notice Decentralized token locking platform with reward calculation
 * @dev Secure vault for locking ERC20 tokens with individual user compartments
 * 
 * Features:
 * - Individual user compartments for isolated token management
 * - APY-based reward calculation
 * - Multiple simultaneous locks per user
 * - Emergency withdrawal with configurable penalty
 * - Owner controls for reward rates and system parameters
 * - Comprehensive event logging for transparency
 */
contract DeVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                               CONSTANTS
    //////////////////////////////////////////////////////////////*/
    
    /// @notice Basis points denominator (10000 = 100%)
    uint256 public constant BASIS_POINTS = 10000;
    
    /// @notice Seconds in one year for reward calculations
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    
    /// @notice Annual reward rate in basis points (e.g., 1000 = 10%)
    uint256 public rewardRate;
    
    /// @notice Minimum lock duration in seconds
    uint256 public minLockDuration;
    
    /// @notice Maximum lock duration in seconds
    uint256 public maxLockDuration;
    
    /// @notice Penalty in basis points for early withdrawal
    uint256 public earlyWithdrawalPenalty;
    
    /// @dev Counter for generating unique lock IDs
    uint256 private _lockIdCounter;

    /*//////////////////////////////////////////////////////////////
                               STRUCTS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Represents a single token lock
     * @dev Each user can have multiple locks (their compartment)
     */
    struct Lock {
        uint256 id;              // Unique lock identifier
        address token;           // Address of locked ERC20 token
        uint256 amount;          // Amount of tokens locked
        uint256 lockTime;        // Timestamp when tokens were locked
        uint256 unlockTime;      // Timestamp when tokens can be withdrawn
        uint256 duration;        // Lock duration in seconds
        bool withdrawn;          // Whether tokens have been withdrawn
        uint256 rewardsClaimed;  // Rewards claimed (for tracking)
    }

    /*//////////////////////////////////////////////////////////////
                              MAPPINGS
    //////////////////////////////////////////////////////////////*/
    
    /// @notice User address => array of their locks (user's compartment)
    mapping(address => Lock[]) private userLocks;
    
    /// @notice User address => total amount locked across all locks
    mapping(address => uint256) public totalLocked;
    
    /// @notice User address => token address => balance
    mapping(address => mapping(address => uint256)) public tokenBalances;

    /*//////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Emitted when tokens are locked
     */
    event TokensLocked(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 duration,
        uint256 lockId,
        uint256 unlockTime
    );
    
    /**
     * @notice Emitted when tokens are withdrawn normally
     */
    event TokensWithdrawn(
        address indexed user,
        uint256 indexed lockId,
        address token,
        uint256 amount,
        uint256 rewards
    );
    
    /**
     * @notice Emitted when tokens are withdrawn early with penalty
     */
    event EmergencyWithdrawal(
        address indexed user,
        uint256 indexed lockId,
        address token,
        uint256 amount,
        uint256 penalty
    );
    
    /**
     * @notice Emitted when reward rate is updated
     */
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    
    /**
     * @notice Emitted when lock duration limits are updated
     */
    event LockDurationUpdated(uint256 minDuration, uint256 maxDuration);
    
    /**
     * @notice Emitted when early withdrawal penalty is updated
     */
    event PenaltyUpdated(uint256 oldPenalty, uint256 newPenalty);

    /*//////////////////////////////////////////////////////////////
                             CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Initialize the DeVault contract
     * @param _rewardRate Annual reward rate in basis points
     * @param _minLockDuration Minimum lock duration in seconds
     * @param _maxLockDuration Maximum lock duration in seconds
     * @param _earlyWithdrawalPenalty Penalty for early withdrawal in basis points
     */
    constructor(
        uint256 _rewardRate,
        uint256 _minLockDuration,
        uint256 _maxLockDuration,
        uint256 _earlyWithdrawalPenalty
    ) Ownable(msg.sender) {
        require(_rewardRate <= BASIS_POINTS, "DeVault: Reward rate cannot exceed 100%");
        require(_minLockDuration > 0, "DeVault: Min duration must be positive");
        require(_maxLockDuration > _minLockDuration, "DeVault: Max duration must be greater than min");
        require(_earlyWithdrawalPenalty < BASIS_POINTS, "DeVault: Penalty cannot equal or exceed 100%");

        rewardRate = _rewardRate;
        minLockDuration = _minLockDuration;
        maxLockDuration = _maxLockDuration;
        earlyWithdrawalPenalty = _earlyWithdrawalPenalty;
    }

    /*//////////////////////////////////////////////////////////////
                          USER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Lock tokens for a specified duration
     * @dev Creates a new lock in the user's compartment
     * @param token Address of the ERC20 token to lock
     * @param amount Amount of tokens to lock (in wei)
     * @param duration Lock duration in seconds
     * @return lockId Unique identifier for this lock
     */
    function lockTokens(
        address token,
        uint256 amount,
        uint256 duration
    ) external nonReentrant whenNotPaused returns (uint256 lockId) {
        require(token != address(0), "DeVault: Invalid token address");
        require(amount > 0, "DeVault: Amount must be greater than 0");
        require(duration >= minLockDuration, "DeVault: Duration too short");
        require(duration <= maxLockDuration, "DeVault: Duration too long");

        // Transfer tokens from user to contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Generate unique lock ID
        lockId = _lockIdCounter++;
        uint256 unlockTime = block.timestamp + duration;

        // Create new lock in user's compartment
        Lock memory newLock = Lock({
            id: lockId,
            token: token,
            amount: amount,
            lockTime: block.timestamp,
            unlockTime: unlockTime,
            duration: duration,
            withdrawn: false,
            rewardsClaimed: 0
        });

        // Add lock to user's compartment
        userLocks[msg.sender].push(newLock);
        totalLocked[msg.sender] += amount;
        tokenBalances[msg.sender][token] += amount;

        emit TokensLocked(msg.sender, token, amount, duration, lockId, unlockTime);
    }

    /**
     * @notice Withdraw tokens and claim rewards after lock period
     * @dev Can only be called after lock expires
     * @param lockId ID of the lock to withdraw
     */
    function withdraw(uint256 lockId) external nonReentrant whenNotPaused {
        Lock storage lock = _getLock(msg.sender, lockId);
        
        require(!lock.withdrawn, "DeVault: Tokens already withdrawn");
        require(block.timestamp >= lock.unlockTime, "DeVault: Lock period not expired");

        // Calculate rewards
        uint256 rewards = calculateRewards(msg.sender, lockId);
        uint256 totalAmount = lock.amount + rewards;

        // Mark as withdrawn
        lock.withdrawn = true;
        lock.rewardsClaimed = rewards;
        
        // Update balances
        totalLocked[msg.sender] -= lock.amount;
        tokenBalances[msg.sender][lock.token] -= lock.amount;

        // Transfer tokens and rewards to user
        IERC20(lock.token).safeTransfer(msg.sender, totalAmount);

        emit TokensWithdrawn(msg.sender, lockId, lock.token, lock.amount, rewards);
    }

    /**
     * @notice Emergency withdrawal with penalty (before unlock time)
     * @dev Allows early withdrawal but applies a penalty
     * @param lockId ID of the lock to withdraw early
     */
    function emergencyWithdraw(uint256 lockId) external nonReentrant whenNotPaused {
        Lock storage lock = _getLock(msg.sender, lockId);
        
        require(!lock.withdrawn, "DeVault: Tokens already withdrawn");
        require(block.timestamp < lock.unlockTime, "DeVault: Use normal withdraw after unlock time");

        // Calculate penalty amount
        uint256 penalty = (lock.amount * earlyWithdrawalPenalty) / BASIS_POINTS;
        uint256 amountAfterPenalty = lock.amount - penalty;

        // Mark as withdrawn
        lock.withdrawn = true;
        
        // Update balances
        totalLocked[msg.sender] -= lock.amount;
        tokenBalances[msg.sender][lock.token] -= lock.amount;

        // Transfer tokens minus penalty (penalty remains in contract)
        IERC20(lock.token).safeTransfer(msg.sender, amountAfterPenalty);

        emit EmergencyWithdrawal(msg.sender, lockId, lock.token, amountAfterPenalty, penalty);
    }

    /**
     * @notice Calculate rewards for a specific lock
     * @dev Rewards are calculated based on APY and time locked
     * @param user Address of the user
     * @param lockId ID of the lock
     * @return rewards Calculated reward amount
     */
    function calculateRewards(address user, uint256 lockId) public view returns (uint256 rewards) {
        Lock memory lock = _getLock(user, lockId);
        
        // If already withdrawn, return claimed rewards
        if (lock.withdrawn) {
            return lock.rewardsClaimed;
        }

        // Calculate time elapsed (capped at lock duration)
        uint256 timeElapsed = block.timestamp - lock.lockTime;
        if (timeElapsed > lock.duration) {
            timeElapsed = lock.duration;
        }

        // Calculate rewards: (amount * rewardRate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR)
        rewards = (lock.amount * rewardRate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
    }

    /*//////////////////////////////////////////////////////////////
                         VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Get all locks for a user (their entire compartment)
     * @param user Address of the user
     * @return Array of all locks
     */
    function getUserLocks(address user) external view returns (Lock[] memory) {
        return userLocks[user];
    }

    /**
     * @notice Get only active (not withdrawn) locks for a user
     * @param user Address of the user
     * @return activeLocks Array of active locks
     */
    function getActiveLocks(address user) external view returns (Lock[] memory activeLocks) {
        Lock[] memory allLocks = userLocks[user];
        uint256 activeCount = 0;

        // Count active locks
        for (uint256 i = 0; i < allLocks.length; i++) {
            if (!allLocks[i].withdrawn) {
                activeCount++;
            }
        }

        // Create array of active locks
        activeLocks = new Lock[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allLocks.length; i++) {
            if (!allLocks[i].withdrawn) {
                activeLocks[currentIndex] = allLocks[i];
                currentIndex++;
            }
        }
    }

    /**
     * @notice Get details of a specific lock
     * @param user Address of the user
     * @param lockId ID of the lock
     * @return lock Lock details
     */
    function getLockDetails(address user, uint256 lockId) external view returns (Lock memory lock) {
        return _getLock(user, lockId);
    }

    /**
     * @notice Get total rewards across all active locks for a user
     * @param user Address of the user
     * @return totalRewards Sum of all rewards
     */
    function getTotalRewards(address user) external view returns (uint256 totalRewards) {
        Lock[] memory locks = userLocks[user];
        for (uint256 i = 0; i < locks.length; i++) {
            if (!locks[i].withdrawn) {
                totalRewards += calculateRewards(user, locks[i].id);
            }
        }
    }

    /**
     * @notice Get number of locks for a user
     * @param user Address of the user
     * @return count Total number of locks
     */
    function getUserLockCount(address user) external view returns (uint256 count) {
        return userLocks[user].length;
    }

    /**
     * @notice Get number of active locks for a user
     * @param user Address of the user
     * @return activeCount Number of active locks
     */
    function getActiveLockCount(address user) external view returns (uint256 activeCount) {
        Lock[] memory locks = userLocks[user];
        for (uint256 i = 0; i < locks.length; i++) {
            if (!locks[i].withdrawn) {
                activeCount++;
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                      INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @dev Internal function to get a lock and validate it exists
     * @param user Address of the user
     * @param lockId ID of the lock
     * @return Lock storage reference
     */
    function _getLock(address user, uint256 lockId) internal view returns (Lock storage) {
        Lock[] storage locks = userLocks[user];
        for (uint256 i = 0; i < locks.length; i++) {
            if (locks[i].id == lockId) {
                return locks[i];
            }
        }
        revert("DeVault: Lock not found");
    }

    /*//////////////////////////////////////////////////////////////
                        OWNER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Update reward rate
     * @dev Only callable by owner
     * @param newRate New reward rate in basis points
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= BASIS_POINTS, "DeVault: Rate cannot exceed 100%");
        uint256 oldRate = rewardRate;
        rewardRate = newRate;
        emit RewardRateUpdated(oldRate, newRate);
    }

    /**
     * @notice Update lock duration limits
     * @dev Only callable by owner
     * @param _minLockDuration New minimum duration
     * @param _maxLockDuration New maximum duration
     */
    function setLockDuration(uint256 _minLockDuration, uint256 _maxLockDuration) external onlyOwner {
        require(_minLockDuration > 0, "DeVault: Min duration must be positive");
        require(_maxLockDuration > _minLockDuration, "DeVault: Max must be greater than min");
        minLockDuration = _minLockDuration;
        maxLockDuration = _maxLockDuration;
        emit LockDurationUpdated(_minLockDuration, _maxLockDuration);
    }

    /**
     * @notice Update early withdrawal penalty
     * @dev Only callable by owner
     * @param newPenalty New penalty in basis points
     */
    function setEarlyWithdrawalPenalty(uint256 newPenalty) external onlyOwner {
        require(newPenalty < BASIS_POINTS, "DeVault: Penalty cannot equal or exceed 100%");
        uint256 oldPenalty = earlyWithdrawalPenalty;
        earlyWithdrawalPenalty = newPenalty;
        emit PenaltyUpdated(oldPenalty, newPenalty);
    }

    /**
     * @notice Pause the contract
     * @dev Only callable by owner
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     * @dev Only callable by owner
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Recover ERC20 tokens sent to contract by mistake
     * @dev Only recovers tokens not locked by users. Owner only.
     * @param token Address of token to recover
     * @param amount Amount to recover
     */
    function recoverERC20(address token, uint256 amount) external onlyOwner {
        uint256 contractBalance = IERC20(token).balanceOf(address(this));
        require(amount <= contractBalance, "DeVault: Insufficient balance");
        
        IERC20(token).safeTransfer(owner(), amount);
    }
}
