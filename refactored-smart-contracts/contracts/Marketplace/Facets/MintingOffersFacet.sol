// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '@openzeppelin/contracts/access/IAccessControl.sol';
import '../AppStorage.sol';
import 'hardhat/console.sol';

contract MintingOffersFacet is AccessControlAppStorageEnumerableMarket {

	event AddedMintingOffer(address erc721Address, uint rangeIndex, uint feeSplitsLength, uint offerIndex);

	modifier checkCreatorRole(address erc721Address) {
		require(IAccessControl(erc721Address).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)), "Minter Marketplace: Sender isn't the creator of the contract!");
		_;
	}

	modifier checkMinterRole(address erc721Address) {
		require(hasMinterRole(erc721Address), "Minter Marketplace: This Marketplace isn't a Minter!");
		_;
	}

	modifier mintingOfferExists(uint rangeIndex_) {
		require(s.mintingOffers.length > rangeIndex_, "Minting Marketplace: Minting Offer doesn't exist");
		_;
	}

	function hasMinterRole(address erc721Address) internal view returns (bool) {
		return IAccessControl(erc721Address).hasRole(bytes32(keccak256("MINTER")), address(this));
	}

	function addMintingOffer(
		address erc721Address_,
		uint rangeIndex_,
		feeSplits[] calldata splits,
		bool visible_,
		address nodeAddress_
	) external checkCreatorRole(erc721Address_) checkMinterRole(erc721Address_) {
		mintingOffer storage newOffer = s.mintingOffers.push();
		newOffer.erc721Address = erc721Address_;
		newOffer.nodeAddress = nodeAddress_;
		newOffer.rangeIndex = rangeIndex_;
		newOffer.visible = visible_;
		uint totalPercentage = s.nodeFee + s.treasuryFee;
		for (uint i = 0; i < splits.length; i++) {
			totalPercentage += splits[i].percentage;
			newOffer.fees.push(splits[i]);
		}
		console.log(totalPercentage, (100 * s.decimalPow));
		require(totalPercentage == (100 * s.decimalPow), "Minter Marketplace: Fees don't add up to 100%");
		s.addressToRangeOffer[erc721Address_][rangeIndex_] = s.mintingOffers.length - 1;
		emit AddedMintingOffer(erc721Address_, rangeIndex_, splits.length, s.mintingOffers.length - 1);
	}

	function buyMintingOffer(uint offerIndex_) public mintingOfferExists(offerIndex_) payable {
		mintingOffer storage selectedOffer = s.mintingOffers[offerIndex_];
		require(hasMinterRole(selectedOffer.erc721Address), "Minter Marketplace: This Marketplace isn't a Minter!");
	}
}