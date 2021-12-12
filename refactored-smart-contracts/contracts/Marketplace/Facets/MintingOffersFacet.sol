// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '@openzeppelin/contracts/access/IAccessControl.sol';
import '../AppStorage.sol';
import 'hardhat/console.sol';

interface IRAIR721 {
	struct range {
		uint rangeStart;
		uint rangeEnd;
		uint tokensAllowed;
		uint mintableTokens;
		uint lockedTokens;
		uint rangePrice;
		string rangeName;
	}

	function rangeInfo(uint rangeId) external view returns(range memory data);
}

contract MintingOffersFacet is AccessControlAppStorageEnumerableMarket {

	event AddedMintingOffer(address erc721Address, uint rangeIndex, string rangeName, uint price, uint feeSplitsLength, uint offerIndex);

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

	modifier offerDoesntExist(address erc721Address, uint rangeIndex) {
		require(s.addressToRangeOffer[erc721Address][rangeIndex] == 0, "Minter Marketplace: Range already has an offer");
		if (s.addressToRangeOffer[erc721Address][rangeIndex] == 0 && s.mintingOffers.length > 0) {
			require(s.mintingOffers[0].erc721Address != erc721Address ||
						s.mintingOffers[0].rangeIndex != rangeIndex,
							"Minter Marketplace: Range already has an offer");
		}
		_;
	}

	function hasMinterRole(address erc721Address) internal view returns (bool) {
		return IAccessControl(erc721Address).hasRole(bytes32(keccak256("MINTER")), address(this));
	}

	function getOffersCountForAddress(address erc721Address) public view returns (uint) {
		return s.addressToOffers[erc721Address].length;
	}

	function getOfferInfoForAddress(address erc721Address, uint rangeIndex) public view returns (mintingOffer memory, IRAIR721.range memory) {
		mintingOffer memory selectedOffer = s.mintingOffers[s.addressToOffers[erc721Address][rangeIndex]];
		return (selectedOffer, IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex));
	}

	function getOfferInfo(uint offerIndex) public view returns (mintingOffer memory, IRAIR721.range memory) {
		mintingOffer memory selectedOffer = s.mintingOffers[offerIndex];
		return (selectedOffer, IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex));
	}

	function addMintingOffer(
		address erc721Address_,
		uint rangeIndex_,
		feeSplits[] calldata splits,
		bool visible_,
		address nodeAddress_
	) external checkCreatorRole(erc721Address_) checkMinterRole(erc721Address_) offerDoesntExist(erc721Address_, rangeIndex_) {
		mintingOffer storage newOffer = s.mintingOffers.push();
		IRAIR721.range memory rangeData = IRAIR721(erc721Address_).rangeInfo(rangeIndex_);
		require(rangeData.mintableTokens > 0, "Minter Marketplace: Offer doesn't have tokens available!");
		newOffer.erc721Address = erc721Address_;
		newOffer.nodeAddress = nodeAddress_;
		newOffer.rangeIndex = rangeIndex_;
		newOffer.visible = visible_;
		uint totalPercentage = s.nodeFee + s.treasuryFee;
		for (uint i = 0; i < splits.length; i++) {
			totalPercentage += splits[i].percentage;
			newOffer.fees.push(splits[i]);
		}
		require(totalPercentage == (100 * s.decimalPow), "Minter Marketplace: Fees don't add up to 100%");
		s.addressToOffers[erc721Address_].push(s.mintingOffers.length - 1);
		s.addressToRangeOffer[erc721Address_][rangeIndex_] = s.mintingOffers.length - 1;
		emit AddedMintingOffer(erc721Address_, rangeIndex_, rangeData.rangeName, rangeData.rangePrice, splits.length, s.mintingOffers.length - 1);
	}

	function buyMintingOffer(uint offerIndex_) public mintingOfferExists(offerIndex_) payable {
		mintingOffer storage selectedOffer = s.mintingOffers[offerIndex_];
		require(hasMinterRole(selectedOffer.erc721Address), "Minter Marketplace: This Marketplace isn't a Minter!");
	}
}