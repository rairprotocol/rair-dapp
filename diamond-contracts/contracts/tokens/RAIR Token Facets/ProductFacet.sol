// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import './AppStorage.sol';

contract RAIRProductFacet is AccessControlAppStorageEnumerable721 {
	bytes32 public constant CREATOR = keccak256("CREATOR");
	event ProductCreated(uint indexed id, string name, uint startingToken, uint length);

	/// @notice	Makes sure the product exists before doing changes to it
	/// @param	productID	Product to verify
	modifier productExists(uint productID) {
		require(s.products.length > productID, "RAIR ERC721: Product does not exist");
		_;
	}

	modifier rangeExists(uint rangeID) {
		require(s.ranges.length > rangeID, "RAIR ERC721: Range does not exist");
		_;
	}

	modifier tokenExists(uint tokenIndex) {
		require(s._minted[tokenIndex], "RAIR ERC721: Query for nonexistent token");
		_;
	}

	function ownsTokenInProduct(address find, uint productIndex) public view productExists(productIndex) returns (bool) {
		product storage selectedProduct = s.products[productIndex];
		return _ownsTokenInsideRange(find, selectedProduct.startingToken, selectedProduct.endingToken);
	}

	function ownsTokenInRange(address find, uint rangeIndex) public view rangeExists(rangeIndex) returns (bool) {
		range storage selectedRange = s.ranges[rangeIndex];
		uint startOfProduct = s.products[s.rangeToProduct[rangeIndex]].startingToken;
		return _ownsTokenInsideRange(find, startOfProduct + selectedRange.rangeStart, startOfProduct + selectedRange.rangeEnd);
	}

	function _ownsTokenInsideRange(address find, uint from, uint to) internal view returns (bool) {
		for (uint i = from; i < to; i++) {
			if (s._owners[i] == find) {
				return true;
			}
		}
		return false;
	}

	function tokenByProduct(uint productIndex_, uint tokenIndex_) public view productExists(productIndex_) returns (uint) {
		return s.tokensByProduct[productIndex_][tokenIndex_];
	}

	function productToToken(uint productIndex_, uint tokenIndex_) public view productExists(productIndex_) returns(uint) {
		return s.products[productIndex_].startingToken + tokenIndex_;
	}

	function tokenToProductIndex(uint tokenIndex_) public view tokenExists(tokenIndex_) returns (uint) {
		return tokenIndex_ - s.products[s.tokenToProduct[tokenIndex_]].startingToken;
	}

	function tokenToProduct(uint tokenIndex_) public view tokenExists(tokenIndex_) returns (uint productIndex, uint rangeIndex) {
		productIndex = s.tokenToProduct[tokenIndex_];
		rangeIndex = s.tokenToRange[tokenIndex_];
	}

	/// @notice	Returns the number of products on the contract
	/// @dev	Use with get product to list all of the products
	function getProductCount() external view returns(uint) {
		return s.products.length;
	}

	function getProductInfo(uint productIndex_) external view productExists(productIndex_) returns (product memory) {
		return s.products[productIndex_];
	}

	function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
		require(index < RAIRProductFacet.balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
		return s._ownedTokens[owner][index];
	}

	function balanceOf(address owner) public view returns (uint256) {
		require(owner != address(0), "ERC721: balance query for the zero address");
		return s._balances[owner];
	}

	function _exists(uint256 tokenId) internal view returns (bool) {
        return s._owners[tokenId] != address(0);
    }
	
	/// @notice	Loops through a range of tokens inside a product and returns the first token without an owner
	/// @dev	Uses a loop, do not call this from a non-view function!
	/// @param	productID	Index of the product to search
	/// @param	startingIndex	Index of the product to search
	/// @param	endingIndex		Index of the product to search
	function getNextSequentialIndex(uint productID, uint startingIndex, uint endingIndex) public view productExists(productID) returns(uint nextIndex) {
		product memory currentProduct = s.products[productID];
		for (uint i = currentProduct.startingToken + startingIndex; i <= currentProduct.startingToken + endingIndex; i++) {
			if (!_exists(i)) {
				return i - currentProduct.startingToken;
			}
		}
		require(false, "RAIR ERC721: There are no available tokens in this range.");
	}

	/// @notice	Loops over the user's tokens looking for one that belongs to a product and a specific range
	/// @dev	Loops are expensive in solidity, so don't use this in a function that requires gas
	/// @param	userAddress			User to search
	/// @param	productIndex		Product to search
	/// @param	startingToken		Product to search
	/// @param	endingToken			Product to search
	function hasTokenInProduct(
				address userAddress,
				uint productIndex,
				uint startingToken,
				uint endingToken) public view returns (bool) {
		product memory aux = s.products[productIndex];
		if (aux.endingToken != 0) {
			for (uint i = 0; i < balanceOf(userAddress); i++) {
				uint token = tokenOfOwnerByIndex(userAddress, i);
				if (s.tokenToProduct[token] == productIndex &&
						token >= aux.startingToken + startingToken &&
						token <= aux.startingToken + endingToken) {
					return true;
				}
			}
		}
		return false;
	}

	/// @notice	Returns the number of tokens inside a product
	/// @param	productIndex 	Product index
	function mintedTokensInProduct(uint productIndex) public view returns (uint length) {
		length = s.tokensByProduct[productIndex].length;
	}
	
	/// @notice	Creates a product
	/// @dev	Only a CREATOR can call this function
	/// @param	_productName Name of the product
	/// @param	_copies			Amount of tokens inside the product
	function createProduct(string memory _productName, uint _copies) public onlyRole(CREATOR) {
		uint lastToken = s.products.length == 0 ? 0 : s.products[s.products.length - 1].endingToken + 1;
		
		product storage newProduct = s.products.push();

		newProduct.startingToken = lastToken;
		newProduct.endingToken = newProduct.startingToken + _copies - 1;
		newProduct.name = string(_productName);
		newProduct.mintableTokens = _copies;
		
		emit ProductCreated(s.products.length - 1, _productName, lastToken, _copies);
	}
}