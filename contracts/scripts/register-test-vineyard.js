const hre = require("hardhat");

async function main() {
  console.log("🌱 Registering test vineyard...");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const WineTraceability = await hre.ethers.getContractFactory("WineTraceability");
  const contract = WineTraceability.attach(contractAddress);

  // Get current count
  const currentCount = await contract.vineyardCount();
  const nextId = Number(currentCount) + 1;

  console.log(`Next vineyard ID will be: ${nextId}`);

  // Register vineyard
  const tx = await contract.registerVineyard(
    nextId,
    "Vườn Nho Đà Lạt",
    "Nguyễn Văn A",
    "Cabernet Sauvignon",
    "11.9404",
    "108.4583"
  );

  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log(`✅ Vineyard registered in block ${receipt.blockNumber}`);
  console.log(`🍇 Vineyard ID: ${nextId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
