// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '@openzeppelin/contracts/access/IAccessControl.sol';
import '../AppStorage.sol';

contract MintingOffersFacet is AccessControlAppStorageEnumerableMarket {

	function getDecimals() public view returns (uint16) {
		return s.decimals;
	}

	modifier checkRoles(address erc721Address) {
		require(IAccessControl(erc721Address).hasRole(bytes32(keccak256("MINTER")), address(this)), "Minter Marketplace: This Marketplace isn't a Minter!");
		require(IAccessControl(erc721Address).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)), "Minter Marketplace: Sender isn't the creator of the contract!");
		_;
	}

	function addMintingOffer(
		address erc721Address,
		uint rangeIndex,
		feeSplits[] calldata splits,
		bool visible
	) external checkRoles(erc721Address) {
		
	}
}