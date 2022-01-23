// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

import '@openzeppelin/contracts/access/IAccessControl.sol';
import '../AppStorage.sol';

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

	function rangeInfo(uint rangeId) external view returns(range memory data, uint productIndex);
	function mintFromRange(address to, uint rangeId, uint indexInRange) external;
}

contract MintingOffersFacet is AccessControlAppStorageEnumerableMarket {

	event AddedMintingOffer(address erc721Address, uint rangeIndex, string rangeName, uint price, uint feeSplitsLength, uint offerIndex);
	event TokenMinted(address erc721Address, uint rangeIndex, uint tokenIndex, address buyer);

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

	function getTotalOfferCount() public view returns (uint) {
		return s.mintingOffers.length;
	}

	function getOfferInfoForAddress(address erc721Address, uint rangeIndex) public view returns (uint offerIndex, mintingOffer memory mintOffer, IRAIR721.range memory rangeData, uint productIndex) {
		mintingOffer memory selectedOffer = s.mintingOffers[s.addressToOffers[erc721Address][rangeIndex]];
		(rangeData, productIndex) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
		offerIndex = s.addressToOffers[erc721Address][rangeIndex];
		mintOffer = selectedOffer;
	}

	function getOfferInfo(uint offerIndex) public view returns (mintingOffer memory mintOffer, IRAIR721.range memory rangeData, uint productIndex) {
		mintingOffer memory selectedOffer = s.mintingOffers[offerIndex];
		mintOffer = selectedOffer;
		(rangeData, productIndex) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
	}

	function addMintingOffer(
		address erc721Address_,
		uint rangeIndex_,
		feeSplits[] calldata splits,
		bool visible_,
		address nodeAddress_
	) external {
		_addMintingOffer(erc721Address_, rangeIndex_, splits, visible_, nodeAddress_);
	}

	function addMintingOfferBatch(
		address erc721Address_,
		uint[] calldata rangeIndexes,
		feeSplits[][] calldata splits,
		bool[] calldata visibility,
		address nodeAddress_
	) external {
		require(rangeIndexes.length > 0, "Minter Marketplace: No offers sent!");
		require(rangeIndexes.length == visibility.length && splits.length == visibility.length, "Minter Marketplace: Arrays should have the same length");
		for (uint i = 0; i < rangeIndexes.length; i++) {
			_addMintingOffer(erc721Address_, rangeIndexes[i], splits[i], visibility[i], nodeAddress_);
		}
	}

	function _addMintingOffer(
		address erc721Address_,
		uint rangeIndex_,
		feeSplits[] memory splits,
		bool visible_,
		address nodeAddress_
	) internal checkCreatorRole(erc721Address_) checkMinterRole(erc721Address_) offerDoesntExist(erc721Address_, rangeIndex_) {
		mintingOffer storage newOffer = s.mintingOffers.push();
		(IRAIR721.range memory rangeData,) = IRAIR721(erc721Address_).rangeInfo(rangeIndex_);
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

	function buyMintingOffer(uint offerIndex_, uint tokenIndex_) public mintingOfferExists(offerIndex_) payable {
		mintingOffer storage selectedOffer = s.mintingOffers[offerIndex_];
		require(selectedOffer.visible, "Minter Marketplace: This offer is not ready to be sold!");
		require(hasMinterRole(selectedOffer.erc721Address), "Minter Marketplace: This Marketplace isn't a Minter!");
		(IRAIR721.range memory rangeData,) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
		require(rangeData.rangePrice <= msg.value, "Minter Marketplace: Insufficient funds!");
		if (msg.value - rangeData.rangePrice > 0) {
			payable(msg.sender).transfer(msg.value - rangeData.rangePrice);
		}
		uint totalTransferred = rangeData.rangePrice * (s.nodeFee + s.treasuryFee) / (100 * s.decimalPow);
		payable(selectedOffer.nodeAddress).transfer(rangeData.rangePrice * s.nodeFee / (100 * s.decimalPow));
		payable(s.treasuryAddress).transfer(rangeData.rangePrice * s.treasuryFee / (100 * s.decimalPow));
		uint auxMoneyToBeSent;
		for (uint i = 0; i < selectedOffer.fees.length; i++) {
			auxMoneyToBeSent = rangeData.rangePrice * selectedOffer.fees[i].percentage / (100 * s.decimalPow);
			totalTransferred += auxMoneyToBeSent;
			payable(selectedOffer.fees[i].recipient).transfer(auxMoneyToBeSent);
		}
		require(totalTransferred == rangeData.rangePrice, "Minter Marketplace: Error transferring funds!");
		_buyMintingOffer(selectedOffer.erc721Address, selectedOffer.rangeIndex, tokenIndex_);
	}

	function buyMintingOfferBatch(uint offerIndex_, uint[] calldata tokenIndexes) external mintingOfferExists(offerIndex_) payable {
		require(tokenIndexes.length > 0, "Minter Marketplace: No tokens sent!");
		mintingOffer storage selectedOffer = s.mintingOffers[offerIndex_];
		require(selectedOffer.visible, "Minter Marketplace: This offer is not ready to be sold!");
		require(hasMinterRole(selectedOffer.erc721Address), "Minter Marketplace: This Marketplace isn't a Minter!");
		(IRAIR721.range memory rangeData,) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
		require((rangeData.rangePrice * tokenIndexes.length) <= msg.value, "Minter Marketplace: Insufficient funds!");
		if (msg.value - (rangeData.rangePrice * tokenIndexes.length) > 0) {
			payable(msg.sender).transfer(msg.value - (rangeData.rangePrice * tokenIndexes.length));
		}
		uint totalTransferred = (rangeData.rangePrice * tokenIndexes.length) * (s.nodeFee + s.treasuryFee) / (100 * s.decimalPow);
		payable(selectedOffer.nodeAddress).transfer((rangeData.rangePrice * tokenIndexes.length) * s.nodeFee / (100 * s.decimalPow));
		payable(s.treasuryAddress).transfer((rangeData.rangePrice * tokenIndexes.length) * s.treasuryFee / (100 * s.decimalPow));
		uint auxMoneyToBeSent;
		uint i;
		for (i = 0; i < selectedOffer.fees.length; i++) {
			auxMoneyToBeSent = (rangeData.rangePrice * tokenIndexes.length) * selectedOffer.fees[i].percentage / (100 * s.decimalPow);
			totalTransferred += auxMoneyToBeSent;
			payable(selectedOffer.fees[i].recipient).transfer(auxMoneyToBeSent);
		}
		require(totalTransferred == (rangeData.rangePrice * tokenIndexes.length), "Minter Marketplace: Error transferring funds!");
		for (i = 0; i < tokenIndexes.length; i++) {
			_buyMintingOffer(selectedOffer.erc721Address, selectedOffer.rangeIndex, tokenIndexes[i]);
		}
	}

	function _buyMintingOffer(address erc721Address, uint rangeIndex, uint tokenIndex) internal {
		IRAIR721(erc721Address).mintFromRange(msg.sender, rangeIndex, tokenIndex);
		emit TokenMinted(erc721Address, rangeIndex, tokenIndex, msg.sender);
	}
}