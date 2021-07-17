// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

// Used on interfaces
import '@openzeppelin/contracts/access/AccessControl.sol';
import "../Tokens/IRAIR-ERC721.sol";
import "../Tokens/IERC2981.sol";

// Parent classes
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import "hardhat/console.sol";

/// @title  Minter Marketplace 
/// @notice Handles the minting of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the minting mechanisms on other tokens!
contract Minter_Marketplace is OwnableUpgradeable {
	struct mintableCollection {
		address contractAddress;
		address nodeAddress;
		uint collectionIndex;
		uint tokensAllowed;
		uint price;
	}

	mapping(address => uint[]) public contractToOffers;

	mintableCollection[] catalog;

	address public treasury;
	uint public openSales;
	uint16 public treasuryFee;
	uint16 public nodeFee;

	event AddedCollection(address contractAddress, uint collectionIndex, uint price);
	event UpdatedCollection(address contractAddress, uint collectionIndex, uint price);
	event TokenMinted(address ownerAddress, uint catalogIndex);
	event SoldOut(address contractAddress, uint catalogIndex);

	/// @notice	Constructor
	/// @dev	Should start up with the treasury, node and treasury fee
	/// @param	_treasury		The address of the Treasury
	/// @param	_treasuryFee	Fee given to the treasury every sale (Recommended default: 9%)
	/// @param	_nodeFee		Fee given to the node on every sale (Recommended default: 1%)
	function initialize(address _treasury, uint16 _treasuryFee, uint16 _nodeFee) public initializer {
		treasury = _treasury;
		treasuryFee = _treasuryFee;
		nodeFee = _nodeFee;
		openSales = 0;
	}

	function getOffersFromContract(address _contract) public view returns (uint[] memory) {
		return contractToOffers[_contract];
	} 

	/// @notice	Sets the new treasury address
	/// @dev	Make sure the treasury is a wallet address!
	/// @dev	If the treasury is a contract, make sure it has a receive function!
	/// @param	_newTreasury	New address
	function setTreasuryAddress(address _newTreasury) public onlyOwner {
		treasury = _newTreasury;
	}

	/// @notice	Sets the new treasury fee
	/// @param	_newFee	New Fee
	function setTreasuryFee(uint16 _newFee) public onlyOwner {
		treasuryFee = _newFee;
	}

	/// @notice	Returns the number of collections on the market
	/// @dev	Includes completed collections though
	function getCollectionCount() public view returns(uint) {
		return catalog.length;
	}

	/// @notice	Returns the information about a collection
	/// @dev	Translates the internal collection schema to individual values
	/// @param	_index		Index of the collection INSIDE this contract
	function getCollectionInfo(uint _index) public view returns(address contractAddress, uint collectionIndex, uint tokensAllowed, uint price) {
		mintableCollection memory selectedCollection = catalog[_index];
		return (
			selectedCollection.contractAddress,
			selectedCollection.collectionIndex,
			selectedCollection.tokensAllowed,
			selectedCollection.price
		);
	}

	/// @notice	Adds a collection to the market's catalog
	/// @dev	It validates that the Marketplace is a minter when adding the collection
	/// @dev	It validates that the sender of the transaction is the creator of the contract
	/// @dev	It validates that the collection has mintable tokens left
	/// @dev	It validates that the number of tokens allowed to sell is less or equal than the number of mintable tokens
	/// @param	_tokenAddress		Address of the ERC721
	/// @param	_tokensAllowed		Number of tokens allowed to sell
	/// @param	_collectionIndex	Index of the collection inside the ERC721
	/// @param	_tokenPrice			Price of the individual token IN WEI
	/// @param	_nodeAddress		Address of the node to be paid
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
		openSales++;
		contractToOffers[_tokenAddress].push(catalog.length - 1);
		emit AddedCollection(_tokenAddress, _tokensAllowed, _tokenPrice);
	}

	/// @notice	Updates the sale information
	/// @dev	It validates that the Marketplace is still a minter
	/// @dev	It validates that the sender of the transaction is the creator of the contract
	/// @dev	It validates that the collection has mintable tokens left
	/// @dev	It validates that the new number of tokens allowed to sell is less or equal than the number of mintable tokens
	/// @param	_catalogIndex		Index of the sale within the catalog
	/// @param	_newTokensAllowed	New number of tokens allowed
	/// @param	_tokenPrice			New price of the token
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
		if (selectedCollection.tokensAllowed == 0 && _newTokensAllowed > 0) {
			openSales++;
		}
		selectedCollection.tokensAllowed = _newTokensAllowed;
		emit UpdatedCollection(selectedCollection.contractAddress, _newTokensAllowed, _tokenPrice);
	}

	/// @notice	Receives funds and mints a new token for the sender
	/// @dev	It validates that the Marketplace is still a minter
	/// @dev	It splits the funds in 3 ways
	/// @dev	It validates that the ERC721 token supports the interface for royalties and only then, it will give the funds to the creator
	/// @dev	If the ERC721 collection doesn't have any mintable tokens left, it will revert using the ERC721 error, not in the marketplace!
	/// @param	_collectionID		Index of the sale within the catalog
	function buyToken(uint _collectionID) payable public {
		mintableCollection storage selectedCollection = catalog[_collectionID];
		require(selectedCollection.contractAddress != address(0), "Minting Marketplace: Invalid Collection Selected!");
		require(selectedCollection.tokensAllowed > 0, "Minting Marketplace: Cannot mint more tokens!");
		require(msg.value >= selectedCollection.price, "Minting Marketplace: Insuficient Funds!");
		
		address creatorAddress;
		uint256 amount;

		bool hasFees = IERC2981(selectedCollection.contractAddress).supportsInterface(type(IERC2981).interfaceId);

		if (hasFees) {
			(creatorAddress, amount,) = IRAIR_ERC721(selectedCollection.contractAddress).royaltyInfo(0, selectedCollection.price, '');
			payable(creatorAddress).transfer(selectedCollection.price * (100000 - (treasuryFee + nodeFee)) / 100000);
		}

		payable(msg.sender).transfer(msg.value - selectedCollection.price);
		payable(treasury).transfer((selectedCollection.price * treasuryFee) / 100000);
		payable(selectedCollection.nodeAddress).transfer((selectedCollection.price * nodeFee) / 100000);

		selectedCollection.tokensAllowed--;
		if (selectedCollection.tokensAllowed == 0) {
			openSales--;
			emit SoldOut(selectedCollection.contractAddress, _collectionID);
		}
		IRAIR_ERC721(selectedCollection.contractAddress).mint(msg.sender, selectedCollection.collectionIndex);
		emit TokenMinted(msg.sender, _collectionID);
	}
}