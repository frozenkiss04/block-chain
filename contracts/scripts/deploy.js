const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying WineTraceability Contract...");

  const [deployer] = await hre.ethers.getSigners();
  
  if (!deployer) {
    throw new Error("No signer available. Check Ganache is running and accessible.");
  }
  
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  const WineTraceability = await hre.ethers.getContractFactory("WineTraceability");
  const contract = await WineTraceability.deploy();
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("✅ WineTraceability deployed to:", contractAddress);

  // Save ABI and address to backend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/WineTraceability.sol/WineTraceability.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const backendConfigPath = path.join(__dirname, "../../backend/config");
  if (!fs.existsSync(backendConfigPath)) {
    fs.mkdirSync(backendConfigPath, { recursive: true });
  }

  const contractConfig = {
    address: contractAddress,
    abi: artifact.abi,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(backendConfigPath, "contract.json"),
    JSON.stringify(contractConfig, null, 2)
  );

  console.log("📋 Contract ABI saved to backend/config/contract.json");
  console.log("\n🎉 Deployment completed!");
  console.log("\n📌 Add to backend/.env:");
  console.log(`BLOCKCHAIN_ENABLED=true`);
  console.log(`BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545`);
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
