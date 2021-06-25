// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import "./IRAIR-ERC721.sol";
import "hardhat/console.sol";

contract Minter_Marketplace is Ownable {
	struct mintableCollection {
		address contractAddress;
		address nodeAddress;
		uint collectionIndex;
		uint tokensAllowed;
		uint price;
	}

	mintableCollection[] catalog;

	address public treasury;
	uint16 public treasuryFee;

	event AddedCollection(address contractAddress, uint collectionIndex, uint price);

	constructor() {}

	function setTreasuryAddress(address _newTreasury) public onlyOwner {
		treasury = _newTreasury;
	}

	function setTreasuryFee(uint16 _newFee) public onlyOwner {
		treasuryFee = _newFee;
	}

	function getCollectionCount() public view returns(uint) {
		return catalog.length;
	}

	function getCollectionInfo(uint _index) public view returns(address, uint, uint, uint) {
		mintableCollection memory selectedCollection = catalog[_index];
		return (
			selectedCollection.contractAddress,
			selectedCollection.collectionIndex,
			selectedCollection.tokensAllowed,
			selectedCollection.price
		);
	}

	function addCollection(
		address _tokenAddress,
		uint _tokensAllowed,
		uint _collectionIndex,
		uint _tokenPrice,
		address _nodeAddress)
	public {
		require(IAccessControl(_tokenAddress).hasRole(bytes32(keccak256("MINTER")), address(this)), "Minting Marketplace: This Marketplace isn't a Minter!");
		require(IAccessControl(_tokenAddress).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)));
		mintableCollection storage newCollection = catalog.push();
		newCollection.contractAddress = _tokenAddress;
		newCollection.nodeAddress = _nodeAddress;
		newCollection.collectionIndex = _collectionIndex;
		newCollection.tokensAllowed = _tokensAllowed;
		newCollection.price = _tokenPrice;
		emit AddedCollection(_tokenAddress, _tokensAllowed, _tokenPrice);
	}

	function buyToken(uint _collectionID) payable public {
		mintableCollection storage selectedCollection = catalog[_collectionID];
		require(selectedCollection.contractAddress != address(0), "Minting Marketplace: Invalid Collection Selected!");
		require(selectedCollection.tokensAllowed > 0, "Minting Marketplace: Cannot mint more tokens!");
		require(msg.value >= selectedCollection.price, "Minting Marketplace: Insuficient Funds!");
		IRAIR_ERC721(selectedCollection.contractAddress).mint(msg.sender, selectedCollection.collectionIndex);
	}
}