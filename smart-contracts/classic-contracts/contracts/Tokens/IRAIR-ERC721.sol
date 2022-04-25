// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IRAIR_ERC721 is IERC721 {

	event ProductCreated(uint indexed id, string name, uint startingToken, uint length);
	event ProductCompleted(uint indexed id, string name);
	
	event RangeLocked(uint productIndex, uint startingToken, uint endingToken, uint tokensLocked, string productName, uint lockIndex);
	event RangeUnlocked(uint productID, uint startingToken, uint endingToken);

	event BaseURIChanged(string newURI);
	event TokenURIChanged(uint tokenId, string newURI);
	event ProductURIChanged(uint productId, string newURI);
	event ContractURIChanged(string newURI);

	// For OpenSea's Freezing
	event PermanentURI(string _value, uint256 indexed _id);
	
	// Get the total number of products in the contract
	function getProductCount() external view returns(uint);

	// Get a specific product in the contract
	function getProduct(uint index) external view returns(uint startingToken, uint endingToken, uint mintableTokensLeft, string memory productName, uint[] memory locks);
	
	// Mint a token inside a product
	function mint(address to, uint productID, uint index) external;

	// Ask for the royalty info of the creator
	function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
		external view returns (address receiver, uint256 royaltyAmount);
}