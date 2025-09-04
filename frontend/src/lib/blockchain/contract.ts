import { BrowserProvider, Contract } from "ethers";
import abi from "./CarbonCreditNFT.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  // Create provider
  const provider = new BrowserProvider(window.ethereum);

  // Get signer (await is required in v6)
  const signer = await provider.getSigner();

  // Create contract instance
  const contract = new Contract(CONTRACT_ADDRESS, abi.abi, signer);

  return contract;
}
