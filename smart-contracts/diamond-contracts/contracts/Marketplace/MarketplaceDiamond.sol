// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

// Parent classes
import './AppStorage.sol';
import '../diamondStandard/Diamond.sol';

/// @title  RAIR ERC721 Marketplace Diamond
/// @notice Handles the trading of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Notice this contract is inheriting from Diamond & AccessControlAppStorageEnumerableMarket
contract MarketplaceDiamond is Diamond, AccessControlAppStorageEnumerableMarket {
	bytes32 public constant MAINTAINER = keccak256("MAINTAINER");
	bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

	constructor(address _diamondCut) Diamond(msg.sender, _diamondCut) {
		s.decimals = 3;
		s.decimalPow = 10**3;
		s.nodeFee = 1 * s.decimalPow;
		s.treasuryFee = 9 * s.decimalPow;
		_setRoleAdmin(MAINTAINER, MAINTAINER);
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(MAINTAINER, msg.sender);
	}
}