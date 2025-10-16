const hre = require("hardhat");

async function main() {
  console.log("Deploying CreatorPlatform contract...");

  const CreatorPlatform = await hre.ethers.getContractFactory("CreatorPlatform");
  const creatorPlatform = await CreatorPlatform.deploy();

  await creatorPlatform.waitForDeployment();

  const address = await creatorPlatform.getAddress();
  console.log("CreatorPlatform deployed to:", address);
  
  console.log("\nContract details:");
  console.log("- Platform Fee:", await creatorPlatform.platformFee(), "basis points (1%)");
  console.log("- Fee Collector:", await creatorPlatform.feeCollector());
  console.log("\nSave this address to your .env file:");
  console.log(`CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

