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

	/// @notice This function returns the information of the selected range
	/// @param rangeId 		  Contains the specific range that we want to check
	/// @return data		  Contains the data inside the range
	/// @return productIndex  Contains the index of the products for the range
	function rangeInfo(uint rangeId) external view returns(range memory data, uint productIndex);
	/// @notice This function allow us to mint token from a specific range 
	/// @param to Contains the address that will mint the token
    /// @param rangeId Contains the range identification where we want to mint
	/// @param indexInRange Contains the index inside the range that we want to use for minting 
	function mintFromRange(address to, uint rangeId, uint indexInRange) external;
}


/// @title  RAIR Diamond - Minting offers facet
/// @notice Facet in charge of the minting offers in the RAIR Marketplace
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerableMarket
contract MintingOffersFacet is AccessControlAppStorageEnumerableMarket {

	/// @notice This event stores in the blockchain when a Minting Offer is Added
    /// @param  erc721Address Contains the address of the erc721
    /// @param  rangeIndex contains the id of the minted token
	/// @param  rangeName contains the name of the range where the token is
	/// @param  price Contains the price of the offer fot the token
    /// @param  feeSplitsLength contains the previous status of the offer
    /// @param  feeSplitsLength Contains the visibility of the offer
	/// @param  offerIndex contains the new status of the offer
	event AddedMintingOffer(address erc721Address, uint rangeIndex, string rangeName, uint price, uint feeSplitsLength, bool visible, uint offerIndex);
	event UpdatedMintingOffer(address erc721Address, uint rangeIndex, uint feeSplitsLength, bool visible, uint offerIndex);
	
	event MintedToken(address erc721Address, uint rangeIndex, uint tokenIndex, address buyer);

	modifier checkCreatorRole(address erc721Address) {
		require(
			IAccessControl(erc721Address).hasRole(bytes32(0x00), address(msg.sender)) ||
			IAccessControl(erc721Address).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)),
			"Minter Marketplace: Sender isn't the creator of the contract!");
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
	/// @param 	addr 	Address to verify
	/// @return bool that indicates if the address is a contract or not
	function isContract(address addr) internal view returns (bool) {
		uint size;
		assembly { size := extcodesize(addr) }
		return size > 0;
	}

	/// @notice Utility function to verify if the Marketplace has a MINTER role
	/// @param  erc721Address 	Address of the ERC721 token with AccessControl
	/// @return bool that indicates if the marketplace has a `MINTER` role or not
	function hasMinterRole(address erc721Address) internal view returns (bool) {
		return IAccessControl(erc721Address).hasRole(bytes32(keccak256("MINTER")), address(this));
	}

	/// @notice Returns the number of offers for a specific ERC721 address
	/// @param  erc721Address 	Address of the ERC721 token
	/// @return uint with the total of offers
	function getOffersCountForAddress(address erc721Address) public view returns (uint) {
		return s.addressToOffers[erc721Address].length;
	}

	/// @notice Returns the number of all the minting offers 
	/// @return uint with the total of offers
	function getTotalOfferCount() public view returns (uint) {
		return s.mintingOffers.length;
	}

	/// @notice This functions show us the information of an offer asociated to a marketplace
	/// @param erc721Address Contains the facet addresses and function selectors
    /// @param rangeIndex Contains the facet addresses and function selectors
	/// @return offerIndex Show us the indexed position of the offer
	/// @return mintOffer Show us the information about the minting offer 
	/// @return rangeData Show us the data about the selected range
	/// @return productIndex Show us the indexed position for the product inside the range
	function getOfferInfoForAddress(address erc721Address, uint rangeIndex) public view returns (uint offerIndex, mintingOffer memory mintOffer, IRAIR721.range memory rangeData, uint productIndex) {
		mintingOffer memory selectedOffer = s.mintingOffers[s.addressToOffers[erc721Address][rangeIndex]];
		(rangeData, productIndex) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
		offerIndex = s.addressToOffers[erc721Address][rangeIndex];
		mintOffer = selectedOffer;
	}

	/// @notice This function show us the information of an selected minting offer
	/// @param 		offerIndex Contains the facet addresses and function selectors
	/// @return 	mintOffer Show us the information about the minting offer 
	/// @return 	rangeData Show us the data about the selected range
	/// @return 	productIndex Show us the indexed position for the product inside the range
	function getOfferInfo(uint offerIndex) public view returns (mintingOffer memory mintOffer, IRAIR721.range memory rangeData, uint productIndex) {
		mintingOffer memory selectedOffer = s.mintingOffers[offerIndex];
		mintOffer = selectedOffer;
		(rangeData, productIndex) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
	}

	/// @notice This function allow us to add a new minting offer
	/// @param erc721Address_ Contains the address of the minter marketplace contract
	/// @param rangeIndex_ Contains the index location of the range where the offer will be placed
	/// @param splits Contains the shares and address to pay when the offer is succesfull 
	/// @param visible_ Contains a boolean to set if the offer is public or not 
	/// @param nodeAddress_ Contains address of the node where the offer was placed
	function addMintingOffer(
		address erc721Address_,
		uint rangeIndex_,
		feeSplits[] calldata splits,
		bool visible_,
		address nodeAddress_
	) external {
		_addMintingOffer(erc721Address_, rangeIndex_, splits, visible_, nodeAddress_);
	}

	/// @notice This function allow us to create a group of minting offers in a single call
	/// @param erc721Address_ Contains the address of the minter marketplace contract
	/// @param rangeIndexes Contains the collection of ranges where the offer will be placed
	/// @param splits Contains the shares and address to pay when the offer is succesfull 
	/// @param visibility Contains a collection of booleans that set the offer as public or not 
	/// @param nodeAddress_ Contains address of the node where the offer was placed
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

	/// @notice This function allow us to add a new minting offer
	/// @dev 	This function requires that account has the role of `CREATOR`
	/// @dev 	This function requires that the marketplace is defined as MINTER
	/// @dev 	This function requires that the range is available to create a new offer
	/// @param erc721Address_ Contains the address of the minter marketplace contract
	/// @param rangeIndex_ Contains the index location of the range where the offer will be placed
	/// @param splits Contains the shares and address to pay when the offer is succesfull 
	/// @param visible_ Contains a boolean to set if the offer is public or not 
	/// @param nodeAddress_ Contains address of the node where the offer was placed
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
		if (rangeData.rangePrice > 0) {
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
		}
		s.addressToOffers[erc721Address_].push(s.mintingOffers.length - 1);
		s.addressToRangeOffer[erc721Address_][rangeIndex_] = s.mintingOffers.length - 1;
		emit AddedMintingOffer(erc721Address_, rangeIndex_, rangeData.rangeName, rangeData.rangePrice, splits.length, visible_, s.mintingOffers.length - 1);
	}

	/// @notice This function allow us to update the parameters of a minting offers
	/// @dev 	This function requires that the mintingOfferExists points to an valid offer  
	/// @param 	mintingOfferId_  Contains index location of the minting offer
	/// @param 	splits_ 		 Contains the shares and address to pay when the offer is succesfull 
	/// @param 	visible_    	 Contains a boolean to set if the offer is public or not 
	function updateMintingOffer (
		uint mintingOfferId_,
		feeSplits[] memory splits_,
		bool visible_
	) external mintingOfferExists(mintingOfferId_) {
		_updateMintingOffer(mintingOfferId_, splits_, visible_);
	}

	/// @notice This function allow us to update the parameters of a minting offers 
	/// @param 	mintingOfferId_  Contains index location of the minting offer
	/// @param 	splits_ 		 Contains the shares and address to pay when the offer is succesfull 
	/// @param 	visible_         Contains a boolean to set if the offer is public or not 
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

	/// @notice This function allow us to buy a minting offers
	/// @dev 	This function requires that the mintingOfferExists points to an valid offer  
	/// @param 	offerIndex_  Contains index location of the offer
	/// @param 	tokenIndex_  Contains the id of the tokens that we want to mint
	function buyMintingOffer(uint offerIndex_, uint tokenIndex_) public mintingOfferExists(offerIndex_) payable {
		mintingOffer storage selectedOffer = s.mintingOffers[offerIndex_];
		require(selectedOffer.visible, "Minter Marketplace: This offer is not ready to be sold!");
		require(hasMinterRole(selectedOffer.erc721Address), "Minter Marketplace: This Marketplace isn't a Minter!");
		(IRAIR721.range memory rangeData,) = IRAIR721(selectedOffer.erc721Address).rangeInfo(selectedOffer.rangeIndex);
		if (rangeData.rangePrice > 0) {
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
		}
		_buyMintingOffer(selectedOffer.erc721Address, selectedOffer.rangeIndex, tokenIndex_, msg.sender);
	}

	/// @notice This function allow us to buy a collection of minting offers
	/// @dev 	This function requires that the mintingOfferExists points to an valid offer  
	/// @param 	offerIndex_  	Contains index location of the offer
	/// @param 	tokenIndexes	Contains the collection of tokens that we want to mint
	/// @param 	recipients 		Contains the collection of addresses that will receive
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
		uint i;
		if (rangeData.rangePrice > 0) {
			require((rangeData.rangePrice * tokenIndexes.length) <= msg.value, "Minter Marketplace: Insufficient funds!");
			if (msg.value - (rangeData.rangePrice * tokenIndexes.length) > 0) {
				payable(msg.sender).transfer(msg.value - (rangeData.rangePrice * tokenIndexes.length));
			}
			uint totalTransferred = (rangeData.rangePrice * tokenIndexes.length) * (s.nodeFee + s.treasuryFee) / (100 * s.decimalPow);
			payable(selectedOffer.nodeAddress).transfer((rangeData.rangePrice * tokenIndexes.length) * s.nodeFee / (100 * s.decimalPow));
			payable(s.treasuryAddress).transfer((rangeData.rangePrice * tokenIndexes.length) * s.treasuryFee / (100 * s.decimalPow));
			uint auxMoneyToBeSent;
			for (i = 0; i < selectedOffer.fees.length; i++) {
				auxMoneyToBeSent = (rangeData.rangePrice * tokenIndexes.length) * selectedOffer.fees[i].percentage / (100 * s.decimalPow);
				totalTransferred += auxMoneyToBeSent;
				payable(selectedOffer.fees[i].recipient).transfer(auxMoneyToBeSent);
			}
			require(totalTransferred == (rangeData.rangePrice * tokenIndexes.length), "Minter Marketplace: Error transferring funds!");
		}
		for (i = 0; i < tokenIndexes.length; i++) {
			_buyMintingOffer(selectedOffer.erc721Address, selectedOffer.rangeIndex, tokenIndexes[i], recipients[i]);
		}
	}

	/// @notice This function is in charge of buying a desired minting offer 
	/// @param erc721Address  Contains the address where the offer is located
	/// @param rangeIndex	  Contains the index location of the range where the token is 
	/// @param tokenIndex  	  Contains the index location of the token to buy 
	/// @param recipient   	  Contains the address of the recipient of the token
	function _buyMintingOffer(address erc721Address, uint rangeIndex, uint tokenIndex, address recipient) internal {
		IRAIR721(erc721Address).mintFromRange(recipient, rangeIndex, tokenIndex);
		emit MintedToken(erc721Address, rangeIndex, tokenIndex, recipient);
	}
}