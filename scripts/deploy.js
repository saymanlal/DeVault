const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting DeVault deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "BNB\n");

  // Get contract parameters from environment or use defaults
  const REWARD_RATE = process.env.REWARD_RATE || 1000; // 10% APY
  const MIN_LOCK_DURATION = process.env.MIN_LOCK_DURATION || 86400; // 1 day
  const MAX_LOCK_DURATION = process.env.MAX_LOCK_DURATION || 31536000; // 365 days
  const EARLY_WITHDRAWAL_PENALTY = process.env.EARLY_WITHDRAWAL_PENALTY || 500; // 5%

  console.log("⚙️  Contract Parameters:");
  console.log("   Reward Rate:", REWARD_RATE, "(", REWARD_RATE / 100, "% APY )");
  console.log("   Min Lock Duration:", MIN_LOCK_DURATION, "seconds (", MIN_LOCK_DURATION / 86400, "days )");
  console.log("   Max Lock Duration:", MAX_LOCK_DURATION, "seconds (", MAX_LOCK_DURATION / 86400, "days )");
  console.log("   Early Withdrawal Penalty:", EARLY_WITHDRAWAL_PENALTY, "(", EARLY_WITHDRAWAL_PENALTY / 100, "% )\n");

  // Deploy DeVault
  console.log("📦 Deploying DeVault contract...");
  const DeVault = await hre.ethers.getContractFactory("DeVault");
  const deVault = await DeVault.deploy(
    REWARD_RATE,
    MIN_LOCK_DURATION,
    MAX_LOCK_DURATION,
    EARLY_WITHDRAWAL_PENALTY
  );

  await deVault.waitForDeployment();
  const deVaultAddress = await deVault.getAddress();
  console.log("✅ DeVault deployed to:", deVaultAddress);

  // Deploy MockToken only for testnet
  let mockTokenAddress = null;
  const networkName = hre.network.name;
  
  if (networkName === "bscTestnet" || networkName === "hardhat" || networkName === "localhost") {
    console.log("\n📦 Deploying MockToken for testing...");
    const MockToken = await hre.ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy(
      "Test Token",
      "TEST",
      18,
      1000000 // 1 million tokens
    );

    await mockToken.waitForDeployment();
    mockTokenAddress = await mockToken.getAddress();
    console.log("✅ MockToken deployed to:", mockTokenAddress);
  }

  // Save deployment addresses
  console.log("\n💾 Saving deployment addresses...");
  const addresses = {
    network: networkName,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    contracts: {
      DeVault: deVaultAddress,
      ...(mockTokenAddress && { MockToken: mockTokenAddress })
    },
    parameters: {
      rewardRate: Number(REWARD_RATE),
      minLockDuration: Number(MIN_LOCK_DURATION),
      maxLockDuration: Number(MAX_LOCK_DURATION),
      earlyWithdrawalPenalty: Number(EARLY_WITHDRAWAL_PENALTY)
    }
  };

  // Save to frontend directory
  const frontendDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const addressesPath = path.join(frontendDir, "addresses.json");
  let existingAddresses = {};
  
  if (fs.existsSync(addressesPath)) {
    existingAddresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  }

  existingAddresses[networkName] = addresses.contracts;
  fs.writeFileSync(addressesPath, JSON.stringify(existingAddresses, null, 2));
  console.log("✅ Addresses saved to:", addressesPath);

  // Save deployment info to root
  const deploymentPath = path.join(__dirname, "../deployments", `${networkName}.json`);
  const deploymentsDir = path.dirname(deploymentPath);
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(addresses, null, 2));
  console.log("✅ Deployment info saved to:", deploymentPath);

  // Copy ABIs to frontend
  console.log("\n📋 Copying ABIs to frontend...");
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  
  // Copy DeVault ABI
  const deVaultArtifact = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "DeVault.sol/DeVault.json"), "utf8")
  );
  fs.writeFileSync(
    path.join(frontendDir, "DeVault.json"),
    JSON.stringify(deVaultArtifact.abi, null, 2)
  );
  console.log("✅ DeVault ABI copied");

  // Copy MockToken ABI if deployed
  if (mockTokenAddress) {
    const mockTokenArtifact = JSON.parse(
      fs.readFileSync(path.join(artifactsDir, "MockToken.sol/MockToken.json"), "utf8")
    );
    fs.writeFileSync(
      path.join(frontendDir, "MockToken.json"),
      JSON.stringify(mockTokenArtifact.abi, null, 2)
    );
    console.log("✅ MockToken ABI copied");
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(60));
  console.log("\n📋 Summary:");
  console.log("   Network:", networkName);
  console.log("   Chain ID:", hre.network.config.chainId);
  console.log("   Deployer:", deployer.address);
  console.log("\n📍 Contract Addresses:");
  console.log("   DeVault:", deVaultAddress);
  if (mockTokenAddress) {
    console.log("   MockToken:", mockTokenAddress);
  }

  // Print verification command
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("\n🔍 To verify contracts on BscScan, run:");
    console.log(`   npx hardhat verify --network ${networkName} ${deVaultAddress} ${REWARD_RATE} ${MIN_LOCK_DURATION} ${MAX_LOCK_DURATION} ${EARLY_WITHDRAWAL_PENALTY}`);
    
    if (mockTokenAddress) {
      console.log(`   npx hardhat verify --network ${networkName} ${mockTokenAddress} "Test Token" "TEST" 18 1000000`);
    }
  }

  console.log("\n📱 Next Steps:");
  console.log("   1. Update frontend with contract addresses ✅ (Already done!)");
  console.log("   2. Verify contracts on BscScan (see command above)");
  console.log("   3. Test the contract functions");
  console.log("   4. Start the frontend: cd frontend && npm start");
  console.log("\n" + "=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
