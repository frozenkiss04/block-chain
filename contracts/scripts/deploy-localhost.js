const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying WineTraceability Contract to Hardhat Node...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  const WineTraceability = await hre.ethers.getContractFactory("WineTraceability");
  const contract = await WineTraceability.deploy();
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("✅ WineTraceability deployed to:", contractAddress);

  // Save contract info to frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/WineTraceability.sol/WineTraceability.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const frontendConfigPath = path.join(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(frontendConfigPath)) {
    fs.mkdirSync(frontendConfigPath, { recursive: true });
  }

  // Save contract config for frontend
  const contractConfig = {
    address: contractAddress,
    abi: artifact.abi,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(frontendConfigPath, "WineTraceability.json"),
    JSON.stringify(contractConfig, null, 2)
  );

  console.log("📋 Contract config saved to frontend/src/contracts/WineTraceability.json");
  console.log("\n🎉 Deployment completed!");
  console.log("\n📌 Next steps:");
  console.log("1. Add Hardhat Network to MetaMask:");
  console.log("   - Network Name: Hardhat Localhost");
  console.log("   - RPC URL: http://127.0.0.1:8545");
  console.log("   - Chain ID: 31337");
  console.log("   - Currency Symbol: ETH");
  console.log("\n2. Import test account to MetaMask:");
  console.log("   - Use one of the private keys from 'npx hardhat node' output");
  console.log("\n3. Start frontend: cd frontend && npm start");
  console.log("\n✅ Contract Address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
