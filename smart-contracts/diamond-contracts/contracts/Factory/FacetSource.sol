// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

// Parent classes
import { Diamond } from '../diamondStandard/Diamond.sol';
import { AccessControlEnumerable } from "../common/DiamondStorage/AccessControlEnumerable.sol";

/// @title 	Facet source
/// @notice Main hub for the ERC721 facets
/// @dev 	To be used alongside the Factory
contract FacetSource is Diamond, AccessControlEnumerable {
	constructor(address _diamondCut) Diamond(msg.sender, _diamondCut) {}
}