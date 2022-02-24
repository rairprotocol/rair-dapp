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


/// @title  RAIR Diamond - Minting offers facet
/// @notice Facet in charge of the minting offers in the RAIR Marketplace
/// @author Juan M. Sanchez M.
contract MintingOffersFacet is AccessControlAppStorageEnumerableMarket {

	event AddedMintingOffer(address erc721Address, uint rangeIndex, string rangeName, uint price, uint feeSplitsLength, uint offerIndex);
	event UpdatedMintingOffer(address erc721Address, uint rangeIndex, uint feeSplitsLength, bool visible, uint offerIndex);
	
	event TokenMinted(address erc721Address, uint rangeIndex, uint tokenIndex, address buyer);

	modifier checkCreatorRole(address erc721Address) {
		require(IAccessControl(erc721Address).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)), "Minter Marketplace: Sender isn't the creator of the contract!");
		_;
	}

	modifier checkMinterRole(address erc721Address) {
		require(hasMinterRole(erc721Address), "Minter Marketplace: This Marketplace isn't a Minter!");
		_;
	}

	modifier mintingOfferExists(uint offerIndex_) {
		require(s.mintingOffers.length > offerIndex_, "Minting Marketplace: Minting Offer doesn't exist");
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

	/// @notice Utility function to verify that the recipient of a custom splits ISN'T a contract
	/// @dev 	This isn't a foolproof function, a contract running code in it's constructor has a code size of 0
	/// @param addr 	Address to verify
	/// @return If the address has a code size bigger than 0 (Wallets don't have code so their code size is 0)
	function isContract(address addr) internal view returns (bool) {
		uint size;
		assembly { size := extcodesize(addr) }
		return size > 0;
	}

	/// @notice Utility function to verify if the Marketplace has a MINTER role
	/// @param  erc721Address 	Address of the ERC721 token with AccessControl
	function hasMinterRole(address erc721Address) internal view returns (bool) {
		return IAccessControl(erc721Address).hasRole(bytes32(keccak256("MINTER")), address(this));
	}

	/// @notice Returns the number of offers for a specific ERC721 address
	/// @param  erc721Address 	Address of the ERC721 token
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
		uint totalFunds = rangeData.rangePrice * totalPercentage / (100 * s.decimalPow);
		for (uint i = 0; i < splits.length; i++) {
			require(!isContract(splits[i].recipient), "Minter Marketplace: Contracts can't be recipients of the splits");
			uint splitForPercentage = rangeData.rangePrice * splits[i].percentage / (100 * s.decimalPow);
			require(
				splitForPercentage > 0,
				"Minter Marketplace: A percentage on the array will result in an empty transfer"
			);
			totalFunds += splitForPercentage;
			totalPercentage += splits[i].percentage;
			newOffer.fees.push(splits[i]);
		}
		require(totalPercentage == (100 * s.decimalPow), "Minter Marketplace: Fees don't add up to 100%");
		require(totalFunds == rangeData.rangePrice, "Minter Marketplace: Current fee configuration will result in missing funds");
		s.addressToOffers[erc721Address_].push(s.mintingOffers.length - 1);
		s.addressToRangeOffer[erc721Address_][rangeIndex_] = s.mintingOffers.length - 1;
		emit AddedMintingOffer(erc721Address_, rangeIndex_, rangeData.rangeName, rangeData.rangePrice, splits.length, s.mintingOffers.length - 1);
	}

	function updateMintingOffer (
		uint mintingOfferId_,
		feeSplits[] memory splits_,
		bool visible_
	) external mintingOfferExists(mintingOfferId_) {
		_updateMintingOffer(mintingOfferId_, splits_, visible_);
	}

	function _updateMintingOffer (
		uint mintingOfferId_,
		feeSplits[] memory splits_,
		bool visible_
	) internal {
		mintingOffer storage selectedOffer = s.mintingOffers[mintingOfferId_];
		require(
			IAccessControl(selectedOffer.erc721Address).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)),
			"Minter Marketplace: Sender isn't the creator of the contract!"
		);
		require(
			hasMinterRole(selectedOffer.erc721Address),
			"Minter Marketplace: This Marketplace isn't a Minter!"
		);
		(IRAIR721.range memory rangeData,) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
		uint totalPercentage = s.nodeFee + s.treasuryFee;
		delete selectedOffer.fees;
		for (uint i = 0; i < splits_.length; i++) {
			require(!isContract(splits_[i].recipient), "Minter Marketplace: Contracts can't be recipients of fees");
			require(
				rangeData.rangePrice * splits_[i].percentage / (100 * s.decimalPow) > 0,
				"Minter Marketplace: A percentage on the array will result in an empty transfer"
			);
			totalPercentage += splits_[i].percentage;
			selectedOffer.fees.push(splits_[i]);
		}
		require(totalPercentage == (100 * s.decimalPow), "Minter Marketplace: Fees don't add up to 100%");
		selectedOffer.visible = visible_;
		emit UpdatedMintingOffer(
			selectedOffer.erc721Address,
			selectedOffer.rangeIndex,
			selectedOffer.fees.length,
			selectedOffer.visible,
			mintingOfferId_
		);
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
		_buyMintingOffer(selectedOffer.erc721Address, selectedOffer.rangeIndex, tokenIndex_, msg.sender);
	}

	function buyMintingOfferBatch(
		uint offerIndex_,
		uint[] calldata tokenIndexes,
		address[] calldata recipients		
	) external mintingOfferExists(offerIndex_) payable {
		require(tokenIndexes.length > 0, "Minter Marketplace: No tokens sent!");
		require(tokenIndexes.length == recipients.length, "Minter Marketplace: Tokens and Addresses should have the same length");
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
			_buyMintingOffer(selectedOffer.erc721Address, selectedOffer.rangeIndex, tokenIndexes[i], recipients[i]);
		}
	}

	function _buyMintingOffer(address erc721Address, uint rangeIndex, uint tokenIndex, address recipient) internal {
		IRAIR721(erc721Address).mintFromRange(recipient, rangeIndex, tokenIndex);
		emit TokenMinted(erc721Address, rangeIndex, tokenIndex, recipient);
	}
}