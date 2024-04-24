// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

abstract contract ERC721AccessControlRoles {
	bytes32 public constant TRADER = keccak256("TRADER");
	bytes32 public constant MINTER = keccak256("MINTER");
	bytes32 public constant CREATOR = keccak256("CREATOR");
}