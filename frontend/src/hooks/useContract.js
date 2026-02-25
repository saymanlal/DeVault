import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DeVaultABI from '../contracts/DeVault.json';
import MockTokenABI from '../contracts/MockToken.json';
import addresses from '../contracts/addresses.json';

const useContract = (signer, provider) => {
  const [deVaultContract, setDeVaultContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signer && provider) {
      try {
        // Initialize DeVault contract
        const deVault = new ethers.Contract(
          addresses.DeVault,
          DeVaultABI.abi,
          signer
        );
        setDeVaultContract(deVault);

        // Initialize MockToken contract (can be changed to any ERC20)
        const token = new ethers.Contract(
          addresses.MockToken,
          MockTokenABI.abi,
          signer
        );
        setTokenContract(token);

        console.log('Contracts initialized');
      } catch (err) {
        console.error('Error initializing contracts:', err);
      }
    }
  }, [signer, provider]);

  // Lock tokens
  const lockTokens = async (tokenAddress, amount, unlockTime, beneficiary) => {
    try {
      setLoading(true);
      
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount.toString());
      
      // Call lock function
      const tx = await deVaultContract.lock(
        tokenAddress,
        amountWei,
        unlockTime,
        beneficiary
      );
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      setLoading(false);
      return { success: true, receipt };
    } catch (err) {
      console.error('Error locking tokens:', err);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Unlock tokens
  const unlockTokens = async (lockId) => {
    try {
      setLoading(true);
      
      const tx = await deVaultContract.unlock(lockId);
      console.log('Unlock transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Unlock confirmed:', receipt);
      
      setLoading(false);
      return { success: true, receipt };
    } catch (err) {
      console.error('Error unlocking tokens:', err);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Withdraw unlocked tokens
  const withdrawTokens = async (lockId) => {
    try {
      setLoading(true);
      
      const tx = await deVaultContract.withdraw(lockId);
      console.log('Withdraw transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Withdraw confirmed:', receipt);
      
      setLoading(false);
      return { success: true, receipt };
    } catch (err) {
      console.error('Error withdrawing tokens:', err);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get lock details
  const getLockDetails = async (lockId) => {
    try {
      const lock = await deVaultContract.locks(lockId);
      
      return {
        owner: lock.owner,
        token: lock.token,
        amount: ethers.formatEther(lock.amount),
        unlockTime: Number(lock.unlockTime),
        beneficiary: lock.beneficiary,
        withdrawn: lock.withdrawn,
      };
    } catch (err) {
      console.error('Error getting lock details:', err);
      return null;
    }
  };

  // Get user locks
  const getUserLocks = async (userAddress) => {
    try {
      const lockIds = await deVaultContract.getUserLocks(userAddress);
      return lockIds.map(id => Number(id));
    } catch (err) {
      console.error('Error getting user locks:', err);
      return [];
    }
  };

  // Get total locked amount for a token
  const getTotalLocked = async (tokenAddress) => {
    try {
      const total = await deVaultContract.totalLocked(tokenAddress);
      return ethers.formatEther(total);
    } catch (err) {
      console.error('Error getting total locked:', err);
      return '0';
    }
  };

  // Approve token spending
  const approveToken = async (tokenAddress, amount) => {
    try {
      setLoading(true);
      
      const token = new ethers.Contract(
        tokenAddress,
        MockTokenABI.abi,
        signer
      );
      
      const amountWei = ethers.parseEther(amount.toString());
      
      const tx = await token.approve(addresses.DeVault, amountWei);
      console.log('Approval transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Approval confirmed:', receipt);
      
      setLoading(false);
      return { success: true, receipt };
    } catch (err) {
      console.error('Error approving token:', err);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Check token allowance
  const checkAllowance = async (tokenAddress, ownerAddress) => {
    try {
      const token = new ethers.Contract(
        tokenAddress,
        MockTokenABI.abi,
        provider
      );
      
      const allowance = await token.allowance(ownerAddress, addresses.DeVault);
      return ethers.formatEther(allowance);
    } catch (err) {
      console.error('Error checking allowance:', err);
      return '0';
    }
  };

  // Get token balance
  const getTokenBalance = async (tokenAddress, userAddress) => {
    try {
      const token = new ethers.Contract(
        tokenAddress,
        MockTokenABI.abi,
        provider
      );
      
      const balance = await token.balanceOf(userAddress);
      return ethers.formatEther(balance);
    } catch (err) {
      console.error('Error getting token balance:', err);
      return '0';
    }
  };

  // Get token info
  const getTokenInfo = async (tokenAddress) => {
    try {
      const token = new ethers.Contract(
        tokenAddress,
        MockTokenABI.abi,
        provider
      );
      
      const [name, symbol, decimals] = await Promise.all([
        token.name(),
        token.symbol(),
        token.decimals(),
      ]);
      
      return { name, symbol, decimals: Number(decimals) };
    } catch (err) {
      console.error('Error getting token info:', err);
      return { name: 'Unknown', symbol: 'UNK', decimals: 18 };
    }
  };

  return {
    deVaultContract,
    tokenContract,
    loading,
    lockTokens,
    unlockTokens,
    withdrawTokens,
    getLockDetails,
    getUserLocks,
    getTotalLocked,
    approveToken,
    checkAllowance,
    getTokenBalance,
    getTokenInfo,
  };
};

export default useContract;