// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const CarbonCreditNFT = await hre.ethers.getContractFactory("CarbonCreditNFT");

    // Deploy contract (no .deployed() needed in ethers v6)
    const carbonCreditNFT = await CarbonCreditNFT.deploy();

    console.log("CarbonCreditNFT deployed to:", await carbonCreditNFT.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
