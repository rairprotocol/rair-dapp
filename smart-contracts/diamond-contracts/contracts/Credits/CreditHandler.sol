// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";

import { Diamond } from '../diamondStandard/Diamond.sol';
import { AccessControlEnumerable } from '../common/DiamondStorage/AccessControlEnumerable.sol';
import { CreditHandlerRoles } from './AccessControlRoles.sol';

contract CreditHandler is Diamond, AccessControlEnumerable, CreditHandlerRoles {
	IERC1820Registry internal constant _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    
	constructor(address _diamondCut) Diamond(msg.sender, _diamondCut) {
		_ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
		_setRoleAdmin(ADMINISTRATOR, ADMINISTRATOR);
		_setRoleAdmin(ALLOWED_ERC777, ADMINISTRATOR);
		_setRoleAdmin(WITHDRAW_SIGNER, ADMINISTRATOR);
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(ADMINISTRATOR, msg.sender);
		_grantRole(WITHDRAW_SIGNER, msg.sender);
	}
}