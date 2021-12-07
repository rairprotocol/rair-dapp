// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

// Interfaces
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";

// Parent classes

import './AppStorage.sol';
import '../diamondStandard/Diamond.sol';

/// @title  RAIR ERC721 Factory
/// @notice Handles the deployment of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the reception of ERC777 tokens!
contract FactoryDiamond is Diamond, AccessControlAppStorageEnumerable {
	IERC1820Registry internal constant _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
	
	bytes32 public constant MAINTAINER = keccak256("MAINTAINER");
	bytes32 public constant OWNER = keccak256("OWNER");
	bytes32 public constant ERC777 = keccak256("ERC777");
	bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

	constructor(address _diamondCut) Diamond(msg.sender, _diamondCut) {
		_ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
		s.failsafe = 'This is a test!';
		_setRoleAdmin(OWNER, OWNER);
		_setRoleAdmin(ERC777, OWNER);
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(OWNER, msg.sender);
	}

	/*
	event TokensWithdrawn(address recipient, address erc777, uint amount);

	/// @notice Transfers tokens from the factory to any of the OWNER addresses
	/// @dev 	If the contract has less than the amount, the ERC777 contract will revert
	/// @dev 	AccessControl makes sure only an OWNER can withdraw
	/// @param 	erc777	Address of the ERC777 contract
	/// @param 	amount	Amount of tokens to withdraw
	function withdrawTokens(address erc777, uint amount) public onlyRole(OWNER) {
		require(hasRole(ERC777, erc777), "RAIR Factory: Specified contract isn't an approved erc777 contract");
		IERC777(erc777).send(msg.sender, amount, "Factory Withdraw");
		emit TokensWithdrawn(msg.sender, erc777, amount);
	}

	/// @notice	Adds an address to the list of allowed minters
	/// @param	_erc777Address	Address of the new Token
	function add777Token(address _erc777Address, uint _pricePerToken) public onlyRole(OWNER) {
		grantRole(ERC777, _erc777Address);
		deploymentCostForERC777[_erc777Address] = _pricePerToken;
		emit NewTokensAccepted(_erc777Address, _pricePerToken);
	}

	
	*/
}