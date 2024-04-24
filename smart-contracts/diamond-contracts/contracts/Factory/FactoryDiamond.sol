// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

// Parent classes
import { Diamond } from '../diamondStandard/Diamond.sol';
import { AccessControlEnumerable } from "../common/DiamondStorage/AccessControlEnumerable.sol";
import { FactoryHandlerRoles } from './AccessControlRoles.sol';

/// @title  RAIR ERC721 Factory
/// @notice Handles the deployment of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
contract FactoryDiamond is Diamond, AccessControlEnumerable, FactoryHandlerRoles {
	constructor(address _diamondCut) Diamond(msg.sender, _diamondCut) {
		_setRoleAdmin(ADMINISTRATOR, ADMINISTRATOR);
		_setRoleAdmin(WITHDRAW_SIGNER, ADMINISTRATOR);
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(ADMINISTRATOR, msg.sender);
		_grantRole(WITHDRAW_SIGNER, msg.sender);
	}
}