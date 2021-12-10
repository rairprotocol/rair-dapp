// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import './AppStorage.sol';

contract RAIRRangesFacet is AccessControlAppStorageEnumerable721 {
	bytes32 public constant CREATOR = keccak256("CREATOR");

	event CreatedRange(uint productIndex, uint start, uint end, uint price, uint tokensAllowed, uint lockedTokens, string name, uint rangeIndex);
	event UpdatedRange(uint rangeIndex, uint price, uint tokensAllowed, uint lockedTokens);

	// Auxiliary struct used to avoid Stack too deep errors
	struct offerData {
		uint rangeStart;
		uint rangeEnd;
		uint price;
		uint tokensAllowed;
		uint lockedTokens;
		string name;
	}

	function rangeInfo(uint rangeId) public view returns(range memory data) {
		require(s.ranges.length > rangeId, "RAIR ERC721 Ranges: Range does not exist");
		data = s.ranges[rangeId];
	}

	function productRangeInfo(uint productId, uint rangeIndex) public view returns(range memory data) {
		require(s.products.length > productId, "RAIR ERC721 Ranges: Product does not exist");
		require(s.products[productId].rangeList.length > rangeIndex, "RAIR ERC721 Ranges: Product does not exist");
		data = s.ranges[s.products[productId].rangeList[rangeIndex]];
	}

	function updateRange(uint rangeId, uint price_, uint tokensAllowed_, uint lockedTokens_) public onlyRole(CREATOR) {
		require(s.ranges.length > rangeId, "RAIR ERC721 Ranges: Range does not exist");
		range storage selectedRange = s.ranges[rangeId];
		selectedRange.tokensAllowed = tokensAllowed_;
		selectedRange.lockedTokens = lockedTokens_;
		selectedRange.rangePrice = price_;
		emit UpdatedRange(rangeId, price_, tokensAllowed_, lockedTokens_);
	}
	
	function _createRange(uint productId_, uint rangeStart_, uint rangeEnd_, uint price_, uint tokensAllowed_, uint lockedTokens_, string memory name_) internal {
		range storage newRange = s.ranges.push();
		newRange.rangeStart = rangeStart_;
		newRange.rangeEnd = rangeEnd_;
		newRange.tokensAllowed = tokensAllowed_;
		newRange.lockedTokens = lockedTokens_;
		newRange.rangePrice = price_;
		newRange.rangeName = name_;
		uint rangeIndex = s.ranges.length - 1;
		s.rangeToProduct[rangeIndex] = productId_;
		product storage selectedProduct = s.products[productId_];
		selectedProduct.rangeList.push(rangeIndex);
		emit CreatedRange(productId_, rangeStart_, rangeEnd_, price_, tokensAllowed_, lockedTokens_, name_, rangeIndex);

	}

	function createRange(uint productId, uint rangeStart, uint rangeEnd, uint price, uint tokensAllowed, uint lockedTokens, string calldata name) external onlyRole(CREATOR) {
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		_createRange(productId, rangeStart, rangeEnd, price, tokensAllowed, lockedTokens, name);
	}

	function createRangeBatch(
		uint productId,
		offerData[] calldata data
	) external onlyRole(CREATOR) {
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		for (uint i = 0; i < data.length; i++) {
			_createRange(productId, data[i].rangeStart, data[i].rangeEnd, data[i].price, data[i].tokensAllowed, data[i].lockedTokens, data[i].name);
		}
	}
}