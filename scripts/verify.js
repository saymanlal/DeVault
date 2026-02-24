const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Starting contract verification...\n");

  const networkName = hre.network.name;
  console.log("📡 Network:", networkName);

  // Load deployment addresses
  const deploymentPath = path.join(__dirname, "../deployments", `${networkName}.json`);
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Deployment file not found:", deploymentPath);
    console.log("   Please deploy the contracts first using: npm run deploy:testnet");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("📋 Loaded deployment from:", deploymentPath);

  const { DeVault, MockToken } = deployment.contracts;
  const { rewardRate, minLockDuration, maxLockDuration, earlyWithdrawalPenalty } = deployment.parameters;

  // Verify DeVault
  console.log("\n🔐 Verifying DeVault contract...");
  console.log("   Address:", DeVault);
  
  try {
    await hre.run("verify:verify", {
      address: DeVault,
      constructorArguments: [
        rewardRate,
        minLockDuration,
        maxLockDuration,
        earlyWithdrawalPenalty
      ],
    });
    console.log("✅ DeVault verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  DeVault already verified");
    } else {
      console.error("❌ DeVault verification failed:", error.message);
    }
  }

  // Verify MockToken if it exists
  if (MockToken) {
    console.log("\n🪙 Verifying MockToken contract...");
    console.log("   Address:", MockToken);
    
    try {
      await hre.run("verify:verify", {
        address: MockToken,
        constructorArguments: [
          "Test Token",
          "TEST",
          18,
          1000000
        ],
      });
      console.log("✅ MockToken verified successfully!");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("ℹ️  MockToken already verified");
      } else {
        console.error("❌ MockToken verification failed:", error.message);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Verification process completed!");
  console.log("=".repeat(60));
  console.log("\n📍 View contracts on BscScan:");
  
  const explorerUrl = networkName === "bscTestnet" 
    ? "https://testnet.bscscan.com/address/"
    : "https://bscscan.com/address/";
  
  console.log("   DeVault:", explorerUrl + DeVault);
  if (MockToken) {
    console.log("   MockToken:", explorerUrl + MockToken);
  }
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification failed:");
    console.error(error);
    process.exit(1);
  });
