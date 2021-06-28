// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import "./IRAIR-ERC721.sol";
import "./IERC2981.sol";
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
	uint16 public nodeFee;

	event AddedCollection(address contractAddress, uint collectionIndex, uint price);
	event UpdatedCollection(address contractAddress, uint collectionIndex, uint price);

	constructor(address _treasury, uint16 _treasuryFee, uint16 _nodeFee) {
		treasury = _treasury;
		treasuryFee = _treasuryFee;
		nodeFee = _nodeFee;
	}

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
		(,,uint mintableTokensLeft,) = IRAIR_ERC721(_tokenAddress).getCollection(_collectionIndex);
		require(mintableTokensLeft >= _tokensAllowed, "Minting Marketplace: Collection doesn't have that many tokens to mint!");
		mintableCollection storage newCollection = catalog.push();
		newCollection.contractAddress = _tokenAddress;
		newCollection.nodeAddress = _nodeAddress;
		newCollection.collectionIndex = _collectionIndex;
		newCollection.tokensAllowed = _tokensAllowed;
		newCollection.price = _tokenPrice;
		emit AddedCollection(_tokenAddress, _tokensAllowed, _tokenPrice);
	}

	function updateCollectionSale(
		uint _catalogIndex,
		uint _newTokensAllowed,
		uint _tokenPrice
	) public {
		mintableCollection storage selectedCollection = catalog[_catalogIndex];
		(,,uint mintableTokensLeft,) = IRAIR_ERC721(selectedCollection.contractAddress).getCollection(selectedCollection.collectionIndex);
		require(_newTokensAllowed <= mintableTokensLeft, "Minting Marketplace: New limit must be lower or equal than the total allowed to mint!");
		require(IAccessControl(selectedCollection.contractAddress).hasRole(bytes32(keccak256("MINTER")), address(this)), "Minting Marketplace: This Marketplace isn't a Minter!");
		require(IAccessControl(selectedCollection.contractAddress).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)));
		selectedCollection.price = _tokenPrice;
		selectedCollection.tokensAllowed = _newTokensAllowed;
		emit UpdatedCollection(selectedCollection.contractAddress, _newTokensAllowed, _tokenPrice);
	}

	function buyToken(uint _collectionID) payable public {
		mintableCollection storage selectedCollection = catalog[_collectionID];
		require(selectedCollection.contractAddress != address(0), "Minting Marketplace: Invalid Collection Selected!");
		require(selectedCollection.tokensAllowed > 0, "Minting Marketplace: Cannot mint more tokens!");
		require(msg.value >= selectedCollection.price, "Minting Marketplace: Insuficient Funds!");
		
		address creatorAddress;
		uint256 amount;

		bool hasFees = IERC2981(selectedCollection.contractAddress).supportsInterface(type(IERC2981).interfaceId);

		//console.log('Has fees', hasFees);

		if (hasFees) {
			(creatorAddress, amount,) = IRAIR_ERC721(selectedCollection.contractAddress).royaltyInfo(0, selectedCollection.price, 'REEEEE');
			//console.log('Gotta pay', selectedCollection.price * (100000 - (treasuryFee + nodeFee)) / 100000, 'to', creatorAddress);
			payable(creatorAddress).transfer(selectedCollection.price * (100000 - (treasuryFee + nodeFee)) / 100000);
		}

		//console.log('Receiving', msg.value, 'ETH');
		//console.log('Gotta return', msg.value - selectedCollection.price, 'to', msg.sender);
		payable(msg.sender).transfer(msg.value - selectedCollection.price);
		//console.log('Gotta pay', (selectedCollection.price * treasuryFee) / 100000, 'to', treasury);
		payable(treasury).transfer((selectedCollection.price * treasuryFee) / 100000);
		//console.log('Gotta pay', (selectedCollection.price * nodeFee) / 100000, 'to', selectedCollection.nodeAddress);
		payable(selectedCollection.nodeAddress).transfer((selectedCollection.price * nodeFee) / 100000);

		selectedCollection.tokensAllowed--;
		IRAIR_ERC721(selectedCollection.contractAddress).mint(msg.sender, selectedCollection.collectionIndex);
	}
}