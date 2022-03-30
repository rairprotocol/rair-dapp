// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

// Interfaces
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";

// Parent classes

import './AppStorage.sol';
import '../diamondStandard/Diamond.sol';

/// @title  RAIR ERC721 Factory
/// @notice Handles the deployment of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the reception of ERC777 tokens!
/// @dev	This contract inherit from Diamon and AccessControlAppStorageEnumerable
contract FactoryDiamond is Diamond, AccessControlAppStorageEnumerable {
	IERC1820Registry internal constant _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
	
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
}