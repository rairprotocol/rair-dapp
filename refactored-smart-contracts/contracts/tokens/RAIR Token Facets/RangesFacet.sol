// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import './AppStorage.sol';

contract RAIRRangesFacet is AccessControlAppStorageEnumerable721 {
	bytes32 public constant CREATOR = keccak256("CREATOR");

	event CreatedRange(uint productIndex, uint start, uint end, uint price, uint tokensAllowed, uint lockedTokens, string name, uint rangeIndex);
	event UpdatedRange(uint rangeIndex, uint price, uint tokensAllowed, uint lockedTokens);
	
	event TradingLocked(uint indexed rangeIndex, uint from, uint to, uint lockedTokens);
	event TradingUnlocked(uint indexed rangeIndex, uint from, uint to);

	// Auxiliary struct used to avoid Stack too deep errors
	struct rangeData {
		uint rangeStart;
		uint rangeEnd;
		uint price;
		uint tokensAllowed;
		uint lockedTokens;
		string name;
	}

	function rangeInfo(uint rangeId) external view returns(range memory data) {
		require(s.ranges.length > rangeId, "RAIR ERC721 Ranges: Range does not exist");
		data = s.ranges[rangeId];
	}

	function isRangeLocked(uint rangeId) external view returns (bool) {
		require(s.ranges.length > rangeId, "RAIR ERC721 Ranges: Range does not exist");
		return s.ranges[rangeId].lockedTokens > 0;
	}

	function productRangeInfo(uint productId, uint rangeIndex) external view returns(range memory data) {
		require(s.products.length > productId, "RAIR ERC721 Ranges: Product does not exist");
		require(s.products[productId].rangeList.length > rangeIndex, "RAIR ERC721 Ranges: Invalid range index");
		data = s.ranges[s.products[productId].rangeList[rangeIndex]];
	}

	function updateRange(uint rangeId, uint price_, uint tokensAllowed_, uint lockedTokens_) public onlyRole(CREATOR) {
		require(s.ranges.length > rangeId, "RAIR ERC721 Ranges: Range does not exist");
		range storage selectedRange = s.ranges[rangeId];
		require(selectedRange.rangeEnd - selectedRange.rangeStart + 1 >= tokensAllowed_, "RAIR ERC721: Allowed tokens should be less than range's length");
		require(selectedRange.rangeEnd - selectedRange.rangeStart + 1 >= lockedTokens_, "RAIR ERC721: Locked tokens should be less than range's length");
		selectedRange.tokensAllowed = tokensAllowed_;
		if (lockedTokens_ > 0) {
			emit TradingLocked(rangeId, selectedRange.rangeStart, selectedRange.rangeEnd, lockedTokens_);
			selectedRange.lockedTokens = lockedTokens_;
		}
		selectedRange.rangePrice = price_;
		emit UpdatedRange(rangeId, price_, tokensAllowed_, lockedTokens_);
	}

	function canCreateRange(uint productId_, uint rangeStart_, uint rangeEnd_) public view returns (bool) {
		uint[] memory rangeList = s.products[productId_].rangeList;
		for (uint i = 0; i < rangeList.length; i++) {
			if ((s.ranges[rangeList[i]].rangeStart <= rangeStart_ &&
					s.ranges[rangeList[i]].rangeEnd >= rangeStart_) || 
				(s.ranges[rangeList[i]].rangeStart <= rangeEnd_ &&
					s.ranges[rangeList[i]].rangeEnd >= rangeEnd_)) {
				return false;
			}
		}
		return true;
	}
	
	function _createRange(uint productId_, uint rangeStart_, uint rangeEnd_, uint price_, uint tokensAllowed_, uint lockedTokens_, string memory name_) internal {
		product storage selectedProduct = s.products[productId_];
		range storage newRange = s.ranges.push();
		uint rangeIndex = s.ranges.length - 1;
		require(rangeStart_ <= rangeEnd_, 'RAIR ERC721: Invalid starting or ending token');
		// Add one because the starting token is included!
		require(rangeEnd_ - rangeStart_ + 1 >= tokensAllowed_, "RAIR ERC721: Allowed tokens should be less than range's length");
		require(rangeEnd_ - rangeStart_ + 1 >= lockedTokens_, "RAIR ERC721: Locked tokens should be less than range's length");
		require(canCreateRange(productId_, rangeStart_, rangeEnd_), "RAIR ERC721: Can't create a lock of this range");
		newRange.rangeStart = rangeStart_;
		newRange.rangeEnd = rangeEnd_;
		newRange.tokensAllowed = tokensAllowed_;
		newRange.mintableTokens = rangeEnd_ - rangeStart_ + 1;
		newRange.lockedTokens = lockedTokens_;
		if (lockedTokens_ > 0) {
			emit TradingLocked(rangeIndex, rangeStart_, rangeEnd_, lockedTokens_);
		} else if (lockedTokens_ == 0) {
			emit TradingUnlocked(rangeIndex, rangeStart_, rangeEnd_);
		}
		newRange.rangePrice = price_;
		newRange.rangeName = name_;
		s.rangeToProduct[rangeIndex] = productId_;
		selectedProduct.rangeList.push(rangeIndex);
		emit CreatedRange(productId_, rangeStart_, rangeEnd_, price_, tokensAllowed_, lockedTokens_, name_, rangeIndex);
	}

	function createRange(uint productId, uint rangeStart, uint rangeEnd, uint price, uint tokensAllowed, uint lockedTokens, string calldata name) external onlyRole(CREATOR) {
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		_createRange(productId, rangeStart, rangeEnd, price, tokensAllowed, lockedTokens, name);
	}

	function createRangeBatch(
		uint productId,
		rangeData[] calldata data
	) external onlyRole(CREATOR) {
		require(data.length > 0, "RAIR ERC721: Empty array");
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		for (uint i = 0; i < data.length; i++) {
			_createRange(productId, data[i].rangeStart, data[i].rangeEnd, data[i].price, data[i].tokensAllowed, data[i].lockedTokens, data[i].name);
		}
	}
}