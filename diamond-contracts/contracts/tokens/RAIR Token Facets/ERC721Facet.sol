// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;
import './AppStorage.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/utils/Address.sol';

contract ERC721Facet is AccessControlAppStorageEnumerable721 {
	using Address for address;

	bytes32 public constant TRADER = keccak256("TRADER");
	bytes32 public constant MINTER = keccak256("MINTER");
	bytes32 public constant CREATOR = keccak256("CREATOR");

	event ProductCompleted(uint indexed productIndex);
	event RangeCompleted(uint indexed rangeIndex, uint productIndex);
	
	event TradingUnlocked(uint indexed rangeIndex, uint from, uint to);

	event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
	event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
	event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
	
	function name() public view returns (string memory) {
		return s._name;
	}

	function symbol() public view returns (string memory) {
		return s._symbol;
	}

	function balanceOf(address owner) public view returns (uint256) {
		require(owner != address(0), "ERC721: balance query for the zero address");
		return s._balances[owner];
	}

	function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
		require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
		return s._ownedTokens[owner][index];
	}

	function totalSupply() public view returns (uint256) {
		return s._allTokens.length;
	}

	function tokenByIndex(uint256 index) public view returns (uint256) {
		require(index < totalSupply(), "ERC721Enumerable: global index out of bounds");
		return s._allTokens[index];
	}

	/// @notice Queries if an operator can act on behalf of an owner on all of their tokens
	/// @dev Overrides the OpenZeppelin standard by allowing anyone with the TRADER role to transfer tokens
	/// @param owner 		Owner of the tokens.
	/// @param operator 	Operator of the tokens.
	function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {
		return (hasRole(TRADER, operator) || s._operatorApprovals[owner][operator]);
	}

	function nextMintableTokenInRange(uint rangeIndex) public view returns (uint) {
		require(s.ranges.length > rangeIndex, "RAIR ERC721 Ranges: Range does not exist");
		range memory selectedRange = s.ranges[rangeIndex];
		product memory selectedProduct = s.products[s.rangeToProduct[rangeIndex]];
		for (uint i = selectedRange.rangeStart; i < selectedRange.rangeEnd; i++) {
			if (!_exists(selectedProduct.startingToken + i)) {
				return i;
			}
		}
		require(false, 'RAIR ERC721: There are no tokens available for minting');
	}

	function _mintFromRange(address to, uint rangeId, uint indexInRange) internal {
		require(s.ranges.length > rangeId, "RAIR ERC721: Range does not exist");
		range storage selectedRange = s.ranges[rangeId];
		product storage selectedProduct = s.products[s.rangeToProduct[rangeId]];
		require(selectedProduct.mintableTokens > 0, 'RAIR ERC721: Cannot mint more tokens from this product!');
		require(selectedRange.mintableTokens > 0, 'RAIR ERC721: Cannot mint more tokens from this range!');
		require(selectedRange.tokensAllowed > 0, 'RAIR ERC721: Not allowed to mint more tokens from this range!');
		require(indexInRange >= selectedRange.rangeStart && indexInRange <= selectedRange.rangeEnd, "RAIR ERC721: Invalid token index");
		_safeMint(to, selectedProduct.startingToken + indexInRange, '');
		
		if (selectedRange.tokensAllowed > 0) {
			selectedRange.tokensAllowed--;
		}
		if (selectedRange.mintableTokens > 0) {
			selectedRange.mintableTokens--;
			if (selectedRange.mintableTokens == 0) {
				emit RangeCompleted(rangeId, s.rangeToProduct[rangeId]);
			}
		}
		if (selectedRange.lockedTokens > 0) {
			selectedRange.lockedTokens--;
			if (selectedRange.lockedTokens == 0) {
				emit TradingUnlocked(rangeId, selectedRange.rangeStart, selectedRange.rangeEnd);
			}
		}
		if (selectedProduct.mintableTokens > 0) {
			selectedProduct.mintableTokens--;
			if (selectedProduct.mintableTokens == 0) {
				emit ProductCompleted(s.rangeToProduct[rangeId]);
			}
		}
		s.tokenToProduct[selectedProduct.startingToken + indexInRange] = s.rangeToProduct[rangeId];
		s.tokenToRange[selectedProduct.startingToken + indexInRange] = rangeId;
		s.tokensByProduct[s.rangeToProduct[rangeId]].push(selectedProduct.startingToken + indexInRange);
	}

	function mintFromRangeBatch(
		address[] calldata to,
		uint rangeId,
		uint[] calldata indexInRange
	) external onlyRole(MINTER) {
		require(to.length > 0, "RAIR ERC721: Empty array");
		require(to.length == indexInRange.length, "RAIR ERC721: Both arrays should have the same length");
		for (uint i = 0; i < to.length; i++) {
			_mintFromRange(to[i], rangeId, indexInRange[i]);
		}
	}

	function mintFromRange(address to, uint rangeId, uint indexInRange) external onlyRole(MINTER) {
		_mintFromRange(to, rangeId, indexInRange);
	}

	function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
		require(_exists(tokenId), "ERC721: operator query for nonexistent token");
		address owner = ownerOf(tokenId);
		return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
	}

	function approve(address to, uint256 tokenId) public {
		address owner = ownerOf(tokenId);
		require(to != owner, "ERC721: approval to current owner");

		require(
			_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
			"ERC721: approve caller is not owner nor approved for all"
		);

		_approve(to, tokenId);
	}

	function setApprovalForAll(address operator, bool approved) public {
		_setApprovalForAll(_msgSender(), operator, approved);
	}

	function _setApprovalForAll(
		address owner,
		address operator,
		bool approved
	) internal virtual {
		require(owner != operator, "ERC721: approve to caller");
		s._operatorApprovals[owner][operator] = approved;
		emit ApprovalForAll(owner, operator, approved);
	}

	function _approve(address to, uint256 tokenId) internal virtual {
		s._tokenApprovals[tokenId] = to;
		emit Approval(ownerOf(tokenId), to, tokenId);
	}

	function getApproved(uint256 tokenId) public view returns (address) {
		require(_exists(tokenId), "ERC721: approved query for nonexistent token");
		return s._tokenApprovals[tokenId];
	}
	
	function _exists(uint256 tokenId) internal view virtual returns (bool) {
		return s._owners[tokenId] != address(0);
	}

	function _safeMint(address to, uint256 tokenId) internal virtual {
		_safeMint(to, tokenId, "");
	}

	function _safeMint(
		address to,
		uint256 tokenId,
		bytes memory _data
	) internal virtual {
		_mint(to, tokenId);
		require(
			_checkOnERC721Received(address(0), to, tokenId, _data),
			"ERC721: transfer to non ERC721Receiver implementer"
		);
	}

	function _mint(address to, uint256 tokenId) internal virtual {
		require(to != address(0), "ERC721: mint to the zero address");
		require(!_exists(tokenId), "ERC721: token already minted");

		_beforeTokenTransfer(address(0), to, tokenId);

		s._balances[to] += 1;
		s._owners[tokenId] = to;
		s._minted[tokenId] = true;

		emit Transfer(address(0), to, tokenId);
	}

	function ownerOf(uint256 tokenId) public view returns (address) {
		address owner = s._owners[tokenId];
		require(owner != address(0), "ERC721: owner query for nonexistent token");
		return owner;
	}

	/// @notice Hook being called before every transfer
	/// @dev	Transfer locking happens here!
	/// @param	_from		Token's original owner
	/// @param	_to			Token's new owner
	/// @param	_tokenId	Token's ID
	function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId) internal {
		// If it's not minting or burning 
		if (_from != address(0) && _to != address(0)) {
			_checkRole(TRADER, msg.sender);
			require(s.ranges[s.tokenToRange[_tokenId]].lockedTokens == 0, "RAIR ERC721: Cannot transfer from a locked range!");
		}
		if (_from == address(0)) {
			_addTokenToAllTokensEnumeration(_tokenId);
		} else if (_from != _to) {
			_removeTokenFromOwnerEnumeration(_from, _tokenId);
		}
		if (_to == address(0)) {
			_removeTokenFromAllTokensEnumeration(_tokenId);
		} else if (_to != _from) {
			_addTokenToOwnerEnumeration(_to, _tokenId);
		}
		//require(hasRole(TRADER, _from), 'RAIR ERC721: Transfers cannot be made outside RAIR marketplaces!');
	}

	/**
	 * @dev Private function to add a token to this extension's ownership-tracking data structures.
	 * @param to address representing the new owner of the given token ID
	 * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
	 */
	function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
		uint256 length = balanceOf(to);
		s._ownedTokens[to][length] = tokenId;
		s._ownedTokensIndex[tokenId] = length;
	}

	/**
	 * @dev Private function to add a token to this extension's token tracking data structures.
	 * @param tokenId uint256 ID of the token to be added to the tokens list
	 */
	function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
		s._allTokensIndex[tokenId] = s._allTokens.length;
		s._allTokens.push(tokenId);
	}

	/**
	 * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
	 * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
	 * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
	 * This has O(1) time complexity, but alters the order of the _ownedTokens array.
	 * @param from address representing the previous owner of the given token ID
	 * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
	 */
	function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
		// To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
		// then delete the last slot (swap and pop).

		uint256 lastTokenIndex = balanceOf(from) - 1;
		uint256 tokenIndex = s._ownedTokensIndex[tokenId];

		// When the token to delete is the last token, the swap operation is unnecessary
		if (tokenIndex != lastTokenIndex) {
			uint256 lastTokenId = s._ownedTokens[from][lastTokenIndex];

			s._ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
			s._ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
		}

		// This also deletes the contents at the last position of the array
		delete s._ownedTokensIndex[tokenId];
		delete s._ownedTokens[from][lastTokenIndex];
	}

	/**
	 * @dev Private function to remove a token from this extension's token tracking data structures.
	 * This has O(1) time complexity, but alters the order of the _allTokens array.
	 * @param tokenId uint256 ID of the token to be removed from the tokens list
	 */
	function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
		// To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
		// then delete the last slot (swap and pop).

		uint256 lastTokenIndex = s._allTokens.length - 1;
		uint256 tokenIndex = s._allTokensIndex[tokenId];

		// When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
		// rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
		// an 'if' statement (like in _removeTokenFromOwnerEnumeration)
		uint256 lastTokenId = s._allTokens[lastTokenIndex];

		s._allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
		s._allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

		// This also deletes the contents at the last position of the array
		delete s._allTokensIndex[tokenId];
		s._allTokens.pop();
	}

	function transferFrom(
		address from,
		address to,
		uint256 tokenId
	) public {
		require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
		_transfer(from, to, tokenId);
	}

	/**
	 * @dev See {IERC721-safeTransferFrom}.
	 */
	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId
	) public {
		safeTransferFrom(from, to, tokenId, "");
	}

	/**
	 * @dev See {IERC721-safeTransferFrom}.
	 */
	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) public {
		require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
		_safeTransfer(from, to, tokenId, _data);
	}

	/**
	 * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
	 * are aware of the ERC721 protocol to prevent tokens from being forever locked.
	 *
	 * `_data` is additional data, it has no specified format and it is sent in call to `to`.
	 *
	 * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
	 * implement alternative mechanisms to perform token transfer, such as signature-based.
	 *
	 * Requirements:
	 *
	 * - `from` cannot be the zero address.
	 * - `to` cannot be the zero address.
	 * - `tokenId` token must exist and be owned by `from`.
	 * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
	 *
	 * Emits a {Transfer} event.
	 */
	function _safeTransfer(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) internal {
		_transfer(from, to, tokenId);
		require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
	}

	/**
	 * @dev Transfers `tokenId` from `from` to `to`.
	 *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
	 *
	 * Requirements:
	 *
	 * - `to` cannot be the zero address.
	 * - `tokenId` token must be owned by `from`.
	 *
	 * Emits a {Transfer} event.
	 */
	function _transfer(
		address from,
		address to,
		uint256 tokenId
	) internal {
		require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
		require(to != address(0), "ERC721: transfer to the zero address");

		_beforeTokenTransfer(from, to, tokenId);

		// Clear approvals from the previous owner
		_approve(address(0), tokenId);

		s._balances[from] -= 1;
		s._balances[to] += 1;
		s._owners[tokenId] = to;

		emit Transfer(from, to, tokenId);
	}

	function _checkOnERC721Received(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) private returns (bool) {
		if (to.isContract()) {
			try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data) returns (bytes4 retval) {
				return retval == IERC721Receiver.onERC721Received.selector;
			} catch (bytes memory reason) {
				if (reason.length == 0) {
					revert("ERC721: transfer to non ERC721Receiver implementer");
				} else {
					assembly {
						revert(add(32, reason), mload(reason))
					}
				}
			}
		} else {
			return true;
		}
	}
}