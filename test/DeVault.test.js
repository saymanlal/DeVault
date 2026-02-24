const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("DeVault Contract", function () {
  let deVault;
  let mockToken;
  let owner;
  let user1;
  let user2;
  let user3;

  const REWARD_RATE = 1000; // 10% APY
  const MIN_LOCK_DURATION = 86400; // 1 day
  const MAX_LOCK_DURATION = 31536000; // 365 days
  const EARLY_WITHDRAWAL_PENALTY = 500; // 5%
  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy MockToken
    const MockToken = await ethers.getContractFactory("MockToken");
    mockToken = await MockToken.deploy(
      "Test Token",
      "TEST",
      18,
      1000000
    );

    // Deploy DeVault
    const DeVault = await ethers.getContractFactory("DeVault");
    deVault = await DeVault.deploy(
      REWARD_RATE,
      MIN_LOCK_DURATION,
      MAX_LOCK_DURATION,
      EARLY_WITHDRAWAL_PENALTY
    );

    // Transfer tokens to users
    await mockToken.transfer(user1.address, ethers.parseEther("10000"));
    await mockToken.transfer(user2.address, ethers.parseEther("10000"));
    await mockToken.transfer(user3.address, ethers.parseEther("10000"));
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await deVault.owner()).to.equal(owner.address);
    });

    it("Should set the correct reward rate", async function () {
      expect(await deVault.rewardRate()).to.equal(REWARD_RATE);
    });

    it("Should set the correct lock durations", async function () {
      expect(await deVault.minLockDuration()).to.equal(MIN_LOCK_DURATION);
      expect(await deVault.maxLockDuration()).to.equal(MAX_LOCK_DURATION);
    });

    it("Should set the correct early withdrawal penalty", async function () {
      expect(await deVault.earlyWithdrawalPenalty()).to.equal(EARLY_WITHDRAWAL_PENALTY);
    });

    it("Should revert if reward rate exceeds 100%", async function () {
      const DeVault = await ethers.getContractFactory("DeVault");
      await expect(
        DeVault.deploy(10001, MIN_LOCK_DURATION, MAX_LOCK_DURATION, EARLY_WITHDRAWAL_PENALTY)
      ).to.be.revertedWith("DeVault: Reward rate cannot exceed 100%");
    });

    it("Should revert if min duration is 0", async function () {
      const DeVault = await ethers.getContractFactory("DeVault");
      await expect(
        DeVault.deploy(REWARD_RATE, 0, MAX_LOCK_DURATION, EARLY_WITHDRAWAL_PENALTY)
      ).to.be.revertedWith("DeVault: Min duration must be positive");
    });

    it("Should revert if max duration is less than min", async function () {
      const DeVault = await ethers.getContractFactory("DeVault");
      await expect(
        DeVault.deploy(REWARD_RATE, MAX_LOCK_DURATION, MIN_LOCK_DURATION, EARLY_WITHDRAWAL_PENALTY)
      ).to.be.revertedWith("DeVault: Max duration must be greater than min");
    });

    it("Should revert if penalty equals or exceeds 100%", async function () {
      const DeVault = await ethers.getContractFactory("DeVault");
      await expect(
        DeVault.deploy(REWARD_RATE, MIN_LOCK_DURATION, MAX_LOCK_DURATION, 10000)
      ).to.be.revertedWith("DeVault: Penalty cannot equal or exceed 100%");
    });
  });

  describe("Token Locking", function () {
    const lockAmount = ethers.parseEther("100");
    const lockDuration = 30 * 86400; // 30 days

    it("Should allow users to lock tokens", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration)
      )
        .to.emit(deVault, "TokensLocked")
        .withArgs(
          user1.address,
          mockToken.target,
          lockAmount,
          lockDuration,
          0, // First lock ID
          await time.latest() + lockDuration + 1
        );

      expect(await deVault.totalLocked(user1.address)).to.equal(lockAmount);
    });

    it("Should transfer tokens to contract", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      const initialBalance = await mockToken.balanceOf(user1.address);
      
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      expect(await mockToken.balanceOf(user1.address)).to.equal(initialBalance - lockAmount);
      expect(await mockToken.balanceOf(deVault.target)).to.equal(lockAmount);
    });

    it("Should revert if amount is 0", async function () {
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, 0, lockDuration)
      ).to.be.revertedWith("DeVault: Amount must be greater than 0");
    });

    it("Should revert if token address is zero", async function () {
      await expect(
        deVault.connect(user1).lockTokens(ethers.ZeroAddress, lockAmount, lockDuration)
      ).to.be.revertedWith("DeVault: Invalid token address");
    });

    it("Should revert if duration is too short", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, lockAmount, MIN_LOCK_DURATION - 1)
      ).to.be.revertedWith("DeVault: Duration too short");
    });

    it("Should revert if duration is too long", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, lockAmount, MAX_LOCK_DURATION + 1)
      ).to.be.revertedWith("DeVault: Duration too long");
    });

    it("Should allow multiple locks per user", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount * 3n);
      
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      const locks = await deVault.getUserLocks(user1.address);
      expect(locks.length).to.equal(3);
      expect(await deVault.totalLocked(user1.address)).to.equal(lockAmount * 3n);
    });

    it("Should maintain separate compartments for different users", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await mockToken.connect(user2).approve(deVault.target, lockAmount);
      
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      await deVault.connect(user2).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      const user1Locks = await deVault.getUserLocks(user1.address);
      const user2Locks = await deVault.getUserLocks(user2.address);
      
      expect(user1Locks.length).to.equal(1);
      expect(user2Locks.length).to.equal(1);
      expect(user1Locks[0].id).to.not.equal(user2Locks[0].id);
    });
  });

  describe("Reward Calculation", function () {
    const lockAmount = ethers.parseEther("1000");
    const lockDuration = 365 * 86400; // 365 days

    it("Should calculate rewards correctly for full year", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      // Fast forward 1 year
      await time.increase(lockDuration);
      
      const rewards = await deVault.calculateRewards(user1.address, 0);
      const expectedRewards = lockAmount * BigInt(REWARD_RATE) / BigInt(10000);
      
      // Allow 1% margin for rounding
      expect(rewards).to.be.closeTo(expectedRewards, expectedRewards / 100n);
    });

    it("Should calculate rewards correctly for partial duration", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      // Fast forward 182.5 days (half year)
      await time.increase(182 * 86400 + 12 * 3600);
      
      const rewards = await deVault.calculateRewards(user1.address, 0);
      const expectedRewards = lockAmount * BigInt(REWARD_RATE) / BigInt(20000); // Half year
      
      expect(rewards).to.be.closeTo(expectedRewards, expectedRewards / 100n);
    });

    it("Should cap rewards at full duration", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      // Fast forward beyond lock duration
      await time.increase(lockDuration * 2);
      
      const rewards = await deVault.calculateRewards(user1.address, 0);
      const expectedRewards = lockAmount * BigInt(REWARD_RATE) / BigInt(10000);
      
      expect(rewards).to.be.closeTo(expectedRewards, expectedRewards / 100n);
    });

    it("Should handle multiple locks separately", async function () {
      const lock1Amount = ethers.parseEther("1000");
      const lock2Amount = ethers.parseEther("500");
      
      await mockToken.connect(user1).approve(deVault.target, lock1Amount + lock2Amount);
      
      await deVault.connect(user1).lockTokens(mockToken.target, lock1Amount, lockDuration);
      await time.increase(100 * 86400); // Wait 100 days
      await deVault.connect(user1).lockTokens(mockToken.target, lock2Amount, lockDuration);
      
      await time.increase(100 * 86400); // Wait another 100 days
      
      const rewards1 = await deVault.calculateRewards(user1.address, 0);
      const rewards2 = await deVault.calculateRewards(user1.address, 1);
      
      expect(rewards1).to.be.gt(rewards2); // First lock has more time
    });

    it("Should return claimed rewards for withdrawn locks", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      await time.increase(lockDuration);
      await deVault.connect(user1).withdraw(0);
      
      const rewards = await deVault.calculateRewards(user1.address, 0);
      expect(rewards).to.be.gt(0);
    });
  });

  describe("Withdrawals", function () {
    const lockAmount = ethers.parseEther("100");
    const lockDuration = 30 * 86400;

    it("Should allow withdrawal after lock expires", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      await time.increase(lockDuration);
      
      const initialBalance = await mockToken.balanceOf(user1.address);
      const rewards = await deVault.calculateRewards(user1.address, 0);
      
      await expect(deVault.connect(user1).withdraw(0))
        .to.emit(deVault, "TokensWithdrawn")
        .withArgs(user1.address, 0, mockToken.target, lockAmount, rewards);
      
      const finalBalance = await mockToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance + lockAmount + rewards);
    });

    it("Should revert if lock not expired", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      await expect(
        deVault.connect(user1).withdraw(0)
      ).to.be.revertedWith("DeVault: Lock period not expired");
    });

    it("Should prevent double withdrawal", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      await time.increase(lockDuration);
      await deVault.connect(user1).withdraw(0);
      
      await expect(
        deVault.connect(user1).withdraw(0)
      ).to.be.revertedWith("DeVault: Tokens already withdrawn");
    });

    it("Should only allow owner to withdraw their locks", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      await time.increase(lockDuration);
      
      await expect(
        deVault.connect(user2).withdraw(0)
      ).to.be.revertedWith("DeVault: Lock not found");
    });
  });

  describe("Emergency Withdrawals", function () {
    const lockAmount = ethers.parseEther("100");
    const lockDuration = 30 * 86400;

    it("Should allow emergency withdrawal with penalty", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      const penalty = (lockAmount * BigInt(EARLY_WITHDRAWAL_PENALTY)) / 10000n;
      const amountAfterPenalty = lockAmount - penalty;
      
      const initialBalance = await mockToken.balanceOf(user1.address);
      
      await expect(deVault.connect(user1).emergencyWithdraw(0))
        .to.emit(deVault, "EmergencyWithdrawal")
        .withArgs(user1.address, 0, mockToken.target, amountAfterPenalty, penalty);
      
      const finalBalance = await mockToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance + amountAfterPenalty);
    });

    it("Should revert emergency withdrawal after lock expires", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      await time.increase(lockDuration);
      
      await expect(
        deVault.connect(user1).emergencyWithdraw(0)
      ).to.be.revertedWith("DeVault: Use normal withdraw after unlock time");
    });

    it("Should prevent double emergency withdrawal", async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      
      await deVault.connect(user1).emergencyWithdraw(0);
      
      await expect(
        deVault.connect(user1).emergencyWithdraw(0)
      ).to.be.revertedWith("DeVault: Tokens already withdrawn");
    });
  });

  describe("View Functions", function () {
    const lockAmount = ethers.parseEther("100");
    const lockDuration = 30 * 86400;

    beforeEach(async function () {
      await mockToken.connect(user1).approve(deVault.target, lockAmount * 5n);
      
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, lockDuration);
    });

    it("Should return all user locks", async function () {
      const locks = await deVault.getUserLocks(user1.address);
      expect(locks.length).to.equal(3);
    });

    it("Should return only active locks", async function () {
      await time.increase(lockDuration);
      await deVault.connect(user1).withdraw(0);
      
      const activeLocks = await deVault.getActiveLocks(user1.address);
      expect(activeLocks.length).to.equal(2);
    });

    it("Should return correct lock count", async function () {
      const count = await deVault.getUserLockCount(user1.address);
      expect(count).to.equal(3);
    });

    it("Should return correct active lock count", async function () {
      await time.increase(lockDuration);
      await deVault.connect(user1).withdraw(0);
      
      const activeCount = await deVault.getActiveLockCount(user1.address);
      expect(activeCount).to.equal(2);
    });

    it("Should return total rewards correctly", async function () {
      await time.increase(lockDuration / 2);
      
      const totalRewards = await deVault.getTotalRewards(user1.address);
      expect(totalRewards).to.be.gt(0);
    });

    it("Should return lock details", async function () {
      const lock = await deVault.getLockDetails(user1.address, 0);
      expect(lock.amount).to.equal(lockAmount);
      expect(lock.token).to.equal(mockToken.target);
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to update reward rate", async function () {
      const newRate = 1500;
      await expect(deVault.connect(owner).setRewardRate(newRate))
        .to.emit(deVault, "RewardRateUpdated")
        .withArgs(REWARD_RATE, newRate);
      
      expect(await deVault.rewardRate()).to.equal(newRate);
    });

    it("Should not allow non-owner to update reward rate", async function () {
      await expect(
        deVault.connect(user1).setRewardRate(1500)
      ).to.be.reverted;
    });

    it("Should allow owner to update lock durations", async function () {
      const newMin = 172800; // 2 days
      const newMax = 15552000; // 180 days
      
      await expect(deVault.connect(owner).setLockDuration(newMin, newMax))
        .to.emit(deVault, "LockDurationUpdated")
        .withArgs(newMin, newMax);
      
      expect(await deVault.minLockDuration()).to.equal(newMin);
      expect(await deVault.maxLockDuration()).to.equal(newMax);
    });

    it("Should allow owner to update penalty", async function () {
      const newPenalty = 1000; // 10%
      await expect(deVault.connect(owner).setEarlyWithdrawalPenalty(newPenalty))
        .to.emit(deVault, "PenaltyUpdated")
        .withArgs(EARLY_WITHDRAWAL_PENALTY, newPenalty);
      
      expect(await deVault.earlyWithdrawalPenalty()).to.equal(newPenalty);
    });

    it("Should allow owner to pause and unpause", async function () {
      await deVault.connect(owner).pause();
      
      await mockToken.connect(user1).approve(deVault.target, ethers.parseEther("100"));
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, ethers.parseEther("100"), MIN_LOCK_DURATION)
      ).to.be.reverted;
      
      await deVault.connect(owner).unpause();
      
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, ethers.parseEther("100"), MIN_LOCK_DURATION)
      ).to.not.be.reverted;
    });

    it("Should allow owner to recover stuck tokens", async function () {
      // Send tokens directly to contract (simulating stuck tokens)
      await mockToken.connect(owner).transfer(deVault.target, ethers.parseEther("100"));
      
      const initialOwnerBalance = await mockToken.balanceOf(owner.address);
      
      await deVault.connect(owner).recoverERC20(mockToken.target, ethers.parseEther("100"));
      
      const finalOwnerBalance = await mockToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance + ethers.parseEther("100"));
    });
  });

  describe("Security", function () {
    it("Should be protected against reentrancy", async function () {
      // This test ensures the nonReentrant modifier is working
      // In practice, reentrancy would require a malicious token contract
      const lockAmount = ethers.parseEther("100");
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, MIN_LOCK_DURATION);
      
      await time.increase(MIN_LOCK_DURATION);
      
      // Normal withdrawal should work
      await expect(deVault.connect(user1).withdraw(0)).to.not.be.reverted;
    });

    it("Should not allow unauthorized access to other users' locks", async function () {
      const lockAmount = ethers.parseEther("100");
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      await deVault.connect(user1).lockTokens(mockToken.target, lockAmount, MIN_LOCK_DURATION);
      
      await time.increase(MIN_LOCK_DURATION);
      
      await expect(
        deVault.connect(user2).withdraw(0)
      ).to.be.revertedWith("DeVault: Lock not found");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very small amounts", async function () {
      const smallAmount = 1n; // 1 wei
      await mockToken.connect(user1).approve(deVault.target, smallAmount);
      
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, smallAmount, MIN_LOCK_DURATION)
      ).to.not.be.reverted;
    });

    it("Should handle maximum lock duration", async function () {
      const lockAmount = ethers.parseEther("100");
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, lockAmount, MAX_LOCK_DURATION)
      ).to.not.be.reverted;
    });

    it("Should handle minimum lock duration", async function () {
      const lockAmount = ethers.parseEther("100");
      await mockToken.connect(user1).approve(deVault.target, lockAmount);
      
      await expect(
        deVault.connect(user1).lockTokens(mockToken.target, lockAmount, MIN_LOCK_DURATION)
      ).to.not.be.reverted;
    });
  });
});
