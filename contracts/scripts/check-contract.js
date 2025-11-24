const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking deployed contract...");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const WineTraceability = await hre.ethers.getContractFactory("WineTraceability");
  const contract = WineTraceability.attach(contractAddress);

  // Check vineyard count
  const vineyardCount = await contract.vineyardCount();
  console.log(`\n📊 Total vineyards: ${vineyardCount}`);

  // Check process count
  const processCount = await contract.processCount();
  console.log(`📊 Total processes: ${processCount}`);

  if (vineyardCount > 0) {
    console.log("\n🍇 Vineyards:");
    for (let i = 1; i <= vineyardCount; i++) {
      try {
        const exists = await contract.vineyardExistsCheck(i);
        if (exists) {
          const vineyard = await contract.getVineyard(i);
          console.log(`\nID ${i}:`);
          console.log(`  Name: ${vineyard[1]}`);
          console.log(`  Owner: ${vineyard[2]}`);
          console.log(`  Grape: ${vineyard[3]}`);
        }
      } catch (err) {
        console.log(`  ID ${i}: Error - ${err.message}`);
      }
    }
  } else {
    console.log("\n⚠️  No vineyards registered yet!");
    console.log("💡 Register a vineyard first before uploading processes.");
  }

  if (processCount > 0) {
    console.log("\n📦 Processes:");
    for (let i = 1; i <= processCount; i++) {
      try {
        const exists = await contract.processExists(i);
        if (exists) {
          const process = await contract.getProcess(i);
          console.log(`\nID ${i}:`);
          console.log(`  Vineyard ID: ${process[1]}`);
          console.log(`  Title: ${process[2]}`);
          console.log(`  File: ${process[4]}`);
        }
      } catch (err) {
        console.log(`  ID ${i}: Error - ${err.message}`);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
