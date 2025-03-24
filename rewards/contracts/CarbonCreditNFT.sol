// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(address => uint256) public userPoints;

    event NFTMinted(address recipient, uint256 tokenId, string tokenURI);

    // Pass msg.sender to the Ownable constructor
    constructor() ERC721("Carbon Credit NFT", "CCNFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    // Mint NFT when user reaches a certain point threshold
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter += 1;

        emit NFTMinted(recipient, newTokenId, tokenURI);
        return newTokenId;
    }

    // Update user points
    function updateUserPoints(address user, uint256 points) public onlyOwner {
        userPoints[user] += points;
    }

    // Get user points
    function getUserPoints(address user) public view returns (uint256) {
        return userPoints[user];
    }
}
