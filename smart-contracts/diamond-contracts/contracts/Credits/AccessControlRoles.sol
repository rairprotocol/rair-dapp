// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19; 

abstract contract CreditHandlerRoles {
	bytes32 public constant WITHDRAW_SIGNER = keccak256("rair.creditConsumer.withdrawSystemSigner");
	bytes32 public constant ADMINISTRATOR = keccak256("rair.creditConsumer.administrator");
	bytes32 public constant ALLOWED_ERC777 = keccak256("rair.creditConsumer.allowedTokens");
	bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
}