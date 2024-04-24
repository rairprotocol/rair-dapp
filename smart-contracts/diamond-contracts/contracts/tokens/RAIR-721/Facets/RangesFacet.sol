// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import {ERC721Storage} from "../AppStorage.sol";
import {ERC721AccessControlRoles} from "../AccessControlRoles.sol";
import {AccessControlEnumerable} from "../../../common/DiamondStorage/AccessControlEnumerable.sol";

/// @title  This is contract to manage the Rair token ranges facet
/// @notice You can use this contract to administrate ranges, transfers & minting of the tokens
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerable721
contract RAIRRangesFacet is AccessControlEnumerable, ERC721AccessControlRoles {
	/// @notice This event stores in the blockchain when the NFT range is correctly created
    /// @param  productIndex Contains the position where the product was indexed
	/// @param  start Contains the start position of the range of nft collection
	/// @param  end Contains the last NFT of the range collection
	/// @param  price Contains the selling price for the range of NFT
	/// @param  tokensAllowed Contains all the allowed NFT tokens in the range that are available for sell
	/// @param  lockedTokens Contains all the NFT tokens in the range that are unavailable for sell
	/// @param  name Contains the name for the created NFT collection range
	/// @param  rangeIndex Contains the position where the range was indexed
	event CreatedRange(uint productIndex, uint start, uint end, uint price, uint tokensAllowed, uint lockedTokens, string name, uint rangeIndex);
	/// @notice This event stores in the blockchain when the NFT range is correctly updated
    /// @param  rangeIndex Contains the position where the range was indexed
	/// @param  name Contains the name for the created NFT collection range
	/// @param  price Contains the selling price for the range of NFT
	/// @param  tokensAllowed Contains all the allowed NFT tokens in the range that are available for sell
	/// @param  lockedTokens Contains all the NFT tokens in the range that are unavailable for sell
	event UpdatedRange(uint rangeIndex, string name, uint price, uint tokensAllowed, uint lockedTokens);
	/// @notice This event stores in the blockchain when the NFT range trading is effectively locked  
    /// @param  rangeIndex Contains the position where the range was indexed
	/// @param  from Contains the starting NFT of the range that we want to lock
	/// @param  to Contains the last NFT of the range that we want to lock
	/// @param  lockedTokens Contains all the NFT tokens in the range that are unavailable for sell
	event TradingLocked(uint indexed rangeIndex, uint from, uint to, uint lockedTokens);
	/// @notice This event stores in the blockchain when the NFT range trading is effectively unlocked 
    /// @param  rangeIndex Contains the position where the range was indexed
	/// @param  from Contains the starting NFT of the range that we want to lock
	/// @param  to Contains the last NFT of the range that we want to lock
	event TradingUnlocked(uint indexed rangeIndex, uint from, uint to);

	// Auxiliary struct used to avoid Stack too deep errors
	struct rangeData {
		uint rangeLength;
		uint price;
		uint tokensAllowed;
		uint lockedTokens;
		string name;
	}

	/// @notice Verifies that the range exists
	/// @param	rangeID	Identification of the range to verify
	modifier rangeExists(uint rangeID) {
		require(ERC721Storage.layout().ranges.length > rangeID, "RAIR ERC721 Ranges: Range does not exist");
		_;
	}

	/// @notice This functions verify if the current colecction exist or not
	/// @param	collectionId	Identification of the collection that we want to use
	modifier collectionExists(uint collectionId) {
		require(ERC721Storage.layout().products.length > collectionId, "RAIR ERC721 Ranges: Collection does not exist");
		_;
	}

	/// @notice This functions return us the product that containt the selected range
	/// @dev 	This function requires that the rangeIndex_ points to an existing range 
	/// @param	rangeIndex_		Identification of the range to verify
	/// @return uint which indicates the index of the product
	function rangeToProduct(uint rangeIndex_) public view rangeExists(rangeIndex_) returns (uint) {
		return ERC721Storage.layout().rangeToProduct[rangeIndex_];
	}

	/// @notice This functions allow us to check the information of the range
	/// @dev 	This function requires that the rangeIndex_ points to an existing range 
	/// @param	rangeId	Identification of the range to verify
	/// @return data 			Information about the range
	/// @return productIndex 	Contains the index of the product in the range
	function rangeInfo(uint rangeId) external view rangeExists(rangeId) returns(ERC721Storage.range memory data, uint productIndex) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		data = store.ranges[rangeId];
		productIndex = store.rangeToProduct[rangeId];
	}

	/// @notice This functions shows is the range is currently locked or not 
	/// @dev 	This function requires that the rangeIndex_ points to an existing range 
	/// @param	rangeId	Identification of the range to verify
	/// @return bool with the current status of the range lock
	///			true for lock and false for unlocked
	function isRangeLocked(uint rangeId) external view rangeExists(rangeId) returns (bool) {
		return ERC721Storage.layout().ranges[rangeId].lockedTokens > 0;
	}

	/// @notice This functions shows the information for the range of a product
	/// @param	collectionId	Index of the product to verify
	/// @param	rangeIndex		Index of the range to verify
	/// @return data 			Information about the range
	function productRangeInfo(uint collectionId, uint rangeIndex)
		external
		view
		collectionExists(collectionId)
		returns(ERC721Storage.range memory data)
	{
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		require(
			store.products[collectionId].rangeList.length > rangeIndex,
			"RAIR ERC721 Ranges: Invalid range index"
		);
		data = store.ranges[store.products[collectionId].rangeList[rangeIndex]];
	}

	/// @notice This functions allow us to update the information about a range
	/// @dev 	This function requires that the rangeIndex_ points to an existing range
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @param	rangeId			Identification of the range to verify
	/// @param	name			Contains the name for the created NFT collection range
	/// @param	price_			Contains the selling price for the range of NFT
	/// @param	tokensAllowed_	Contains all the allowed NFT tokens in the range that are available for sell
	/// @param	lockedTokens_	Contains all the NFT tokens in the range that are unavailable for sell
	function updateRange(
		uint rangeId,
		string memory name,
		uint price_,
		uint tokensAllowed_,
		uint lockedTokens_
	) public rangeExists(rangeId) onlyRole(CREATOR) {
		require(
			price_ == 0 || price_ >= 100,
			"RAIR ERC721: Minimum price allowed is 100 wei"
		);
		ERC721Storage.range storage selectedRange = ERC721Storage.layout().ranges[rangeId];
		require(
            tokensAllowed_ <= selectedRange.mintableTokens,
            "RAIR ERC721: Allowed tokens should be less than the number of mintable tokens"
        );
        require(
            lockedTokens_ <= selectedRange.mintableTokens + 1,
			// The +1 allows for permanent lock of the range
            "RAIR ERC721: Locked tokens should be less than the number of mintable tokens"
        );
		selectedRange.tokensAllowed = tokensAllowed_;
		if (lockedTokens_ > 0 && selectedRange.lockedTokens == 0) {
            emit TradingLocked(
                rangeId,
                selectedRange.rangeStart,
                selectedRange.rangeEnd,
                lockedTokens_
            );
        } else if (lockedTokens_ == 0 && selectedRange.lockedTokens > 0) {
            emit TradingUnlocked(
                rangeId,
                selectedRange.rangeStart,
                selectedRange.rangeEnd
            );
        }
		selectedRange.lockedTokens = lockedTokens_;
        selectedRange.rangePrice = price_;
        selectedRange.rangeName = name;
		emit UpdatedRange(rangeId, name, price_, tokensAllowed_, lockedTokens_);
	}

	/// @notice Checks if the information for the range is valid
	/// @param	productId_	Id for product
	/// @param	rangeStart_	NFT to start the range with
	/// @param	rangeEnd_	NFT to end the range with
	/// @return bool 		Response
	function canCreateRange(uint productId_, uint rangeStart_, uint rangeEnd_) public view returns (bool) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		uint[] memory rangeList = store.products[productId_].rangeList;
		for (uint i = 0; i < rangeList.length; i++) {
			if ((store.ranges[rangeList[i]].rangeStart <= rangeStart_ &&
					store.ranges[rangeList[i]].rangeEnd >= rangeStart_) || 
				(store.ranges[rangeList[i]].rangeStart <= rangeEnd_ &&
					store.ranges[rangeList[i]].rangeEnd >= rangeEnd_)) {
				return false;
			}
		}
		return true;
	}
	
	/// @notice This is a internal function that will create the NFT range if the requirements are meet
	/// @param	productId_		Contains the identification for the product
	/// @param	rangeLength_	Number of tokens contained in the range
	/// @param 	price_ 			Contains the selling price for the range of NFT
	/// @param 	tokensAllowed_ 	Contains all the allowed NFT tokens in the range that are available for sell
	/// @param 	lockedTokens_ 	Contains all the NFT tokens in the range that are unavailable for sell
	/// @param 	name_ 			Contains the name for the created NFT collection range
	function _createRange(
		uint productId_,
		uint rangeLength_,
		uint price_,
		uint tokensAllowed_,
		uint lockedTokens_,
		string memory name_
	) internal {
		// Sanity checks
		// 0 to make the offer free, over 100 to make sure paid offers can split the funds correctly
		require(price_ == 0 || price_ >= 100, "RAIR ERC721: Minimum price allowed is 100 wei");
		require(rangeLength_ >= tokensAllowed_, "RAIR ERC721: Allowed tokens should be less than range's length");
		require(rangeLength_ >= lockedTokens_, "RAIR ERC721: Locked tokens should be less than range's length");
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		ERC721Storage.product storage selectedProduct = store.products[productId_];
		uint lastTokenFromPreviousRange;
		if (selectedProduct.rangeList.length > 0) {
			lastTokenFromPreviousRange = store.ranges[selectedProduct.rangeList[selectedProduct.rangeList.length - 1]].rangeEnd + 1;
		}

		ERC721Storage.range storage newRange = store.ranges.push();
		uint rangeIndex = store.ranges.length - 1;

		require(lastTokenFromPreviousRange + rangeLength_ - 1 <= selectedProduct.endingToken , "RAIR ERC721: Range length exceeds collection limits!");

		newRange.rangeStart = lastTokenFromPreviousRange;
		// -1 because it includes the starting token
		newRange.rangeEnd = lastTokenFromPreviousRange + rangeLength_ - 1;
		newRange.tokensAllowed = tokensAllowed_;
		newRange.mintableTokens = rangeLength_;
		newRange.lockedTokens = lockedTokens_;
		if (lockedTokens_ > 0) {
			emit TradingLocked(rangeIndex, newRange.rangeStart, newRange.rangeEnd, newRange.lockedTokens);
		} else if (lockedTokens_ == 0) {
			emit TradingUnlocked(rangeIndex, newRange.rangeStart, newRange.rangeEnd);
		}
		newRange.rangePrice = price_;
		newRange.rangeName = name_;
		store.rangeToProduct[rangeIndex] = productId_;
		selectedProduct.rangeList.push(rangeIndex);

		emit CreatedRange(
			productId_,
			newRange.rangeStart,
			newRange.rangeEnd,
			newRange.rangePrice,
			newRange.tokensAllowed,
			newRange.lockedTokens,
			newRange.rangeName,
			rangeIndex
		);
	}

	/// @notice This function that will create the NFT range if the requirements are meet
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev 	This function require thar the collection ID match a valid collection 
	/// @param	collectionId	Contains the identification for the product
	/// @param	rangeLength		Number of tokens contained in the range
	/// @param 	price 			Contains the selling price for the range of NFT
	/// @param 	tokensAllowed 	Contains all the allowed NFT tokens in the range that are available for sell
	/// @param 	lockedTokens 	Contains all the NFT tokens in the range that are unavailable for sell
	/// @param 	name 			Contains the name for the created NFT collection range
	function createRange(
		uint collectionId,
		uint rangeLength,
		uint price,
		uint tokensAllowed,
		uint lockedTokens,
		string calldata name
	) external onlyRole(CREATOR) collectionExists(collectionId) {
		_createRange(collectionId, rangeLength, price, tokensAllowed, lockedTokens, name);
	}

	/// @notice This function will create as many ranges as the data array requires
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev 	This function require thar the collection ID match a valid collection 
	/// @param	collectionId	Contains the identification for the product
	/// @param	data 			An array with the data for all the ranges that we want to implement 
	function createRangeBatch(
		uint collectionId,
		rangeData[] calldata data
	) external onlyRole(CREATOR) collectionExists(collectionId) {
		require(data.length > 0, "RAIR ERC721: Empty array");
		for (uint i = 0; i < data.length; i++) {
			_createRange(collectionId, data[i].rangeLength, data[i].price, data[i].tokensAllowed, data[i].lockedTokens, data[i].name);
		}
	}
}