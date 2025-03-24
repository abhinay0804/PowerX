import { ethers } from "ethers";
import contractABI from "./contractABI";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export { CONTRACT_ADDRESS };
const getEthereumObject = () => {
  const { ethereum } = window as any;
  if (!ethereum) {
    console.error("Metamask is not installed!");
  }
  return ethereum;
};
export const getProviderAndSigner=async()=>{
  const ethereum=getEthereumObject();
  if (!ethereum) throw new Error("Please install MetaMask to use this feature");
  
  const provider=new ethers.BrowserProvider(ethereum);
  const signer=await provider.getSigner();
  return {provider,signer};
};
export const getContractInstance=async()=>{
  const { signer }=await getProviderAndSigner();
  return new ethers.Contract(CONTRACT_ADDRESS,contractABI.abi,signer);
};
export const getBalance=async()=>{
  try{
    const {signer}=await getProviderAndSigner();
    const contract=await getContractInstance();
    const address=await signer.getAddress();
    const balance=await contract.balanceOf(address);
    return balance.toString();
  } catch (error){
    console.error("Error getting balance:",error);
    throw error;
  }
};
export const getUserNFTs=async()=>{
  try {
    const { signer }=await getProviderAndSigner();
    const contract=await getContractInstance();
    const address=await signer.getAddress();
    const balance=await contract.balanceOf(address);
    const nfts=[];
    for (let i=0;i<balance;i++){
      const tokenId=await contract.tokenOfOwnerByIndex(address,i);
      const tokenURI=await contract.tokenURI(tokenId);
      nfts.push({
        id:tokenId.toString(),
        uri:tokenURI,
      });
    }    
    return nfts;
  } catch (error){
    console.error("Error getting user NFTs:", error);
    throw error;
  }
};
export const mintNFT=async(tokenURI:string)=>{
  try{
    const contract=await getContractInstance();
    const tx=await contract.mintNFT(tokenURI);
    await tx.wait();
    return tx.hash;
  } catch (error){
    console.error("Error minting NFT:",error);
    throw error;
  }
};
export const transferNFT=async(to:string,tokenId:string)=>{
  try{
    const {signer}=await getProviderAndSigner();
    const contract= await getContractInstance();
    const from=await signer.getAddress();
    const tx=await contract.transferFrom(from,to,tokenId);
    await tx.wait();
    return tx.hash;
  } catch (error){
    console.error("Error transferring NFT:",error);
    throw error;
  }
};
export const buyPowerTokens=async(amount:number)=>{
  try{
    const contract=await getContractInstance();
    const value=ethers.parseEther((0.01 * amount).toString());
    const tx=await contract.buyTokens({ value });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error buying tokens:", error);
    throw error;
  }
};
export const sellPowerTokens = async (amount: number) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.sellTokens(amount);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error selling tokens:", error);
    throw error;
  }
};
export const getMarketplaceListings = async () => {
  try {
    const contract = await getContractInstance();
    const listingCount = await contract.getListingCount();
    
    const listings = [];
    for (let i = 0; i < listingCount; i++) {
      const listing = await contract.getListing(i);
      listings.push({
        id: i,
        seller: listing.seller,
        tokenId: listing.tokenId.toString(),
        price: ethers.formatEther(listing.price),
        active: listing.active
      });
    }
    
    return listings;
  } catch (error) {
    console.error("Error getting marketplace listings:", error);
    throw error;
  }
};

// Create a new marketplace listing
export const createListing = async (tokenId: string, price: string) => {
  try {
    const contract = await getContractInstance();
    const priceInWei = ethers.parseEther(price);
    const tx = await contract.createListing(tokenId, priceInWei);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

// Buy an item from the marketplace
export const buyMarketplaceItem = async (listingId: number, price: string) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.buyItem(listingId, { value: ethers.parseEther(price) });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error buying item:", error);
    throw error;
  }
};
