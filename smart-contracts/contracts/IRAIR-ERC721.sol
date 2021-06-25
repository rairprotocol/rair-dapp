// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

interface IRAIR_ERC721 is IERC721 {

	// Get the total number of collections in the contract
	function getCollectionCount() external view returns(uint);

	// Get a specific collection in the contract
	function getCollection(uint index) external view returns(uint startingToken, uint endingToken, uint mintableTokensLeft, string memory collectionName);
	
	// Mint a token inside a collection (Minting happens sequentially)
	function mint(address to, uint collectionID) external;

	// Ask for the royalty info of the creator
	// Value is the price for the token, so if token #1 is being sold for 100 ETH and the creator fee is 30%, you-ll get as a result 30 in _royaltyAmount
	function royaltyInfo(uint256 _tokenId, uint256 _value,	bytes calldata _data)
		external view returns (address _receiver, uint256 _royaltyAmount, bytes memory _royaltyPaymentData);
}