// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import './AppStorage.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import 'hardhat/console.sol';

contract ERC721Facet is AccessControlAppStorageEnumerable721 {
	using Address for address;

	bytes32 public constant TRADER = keccak256("TRADER");
	bytes32 public constant MINTER = keccak256("MINTER");
	bytes32 public constant CREATOR = keccak256("CREATOR");

	event ProductCompleted(uint indexed id, string name);
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
	}

	function mintFromRange(address to, uint rangeId, uint indexInRange) public onlyRole(MINTER) {
		require(s.ranges.length > rangeId, "RAIR ERC721: Range does not exist");
		range storage selectedRange = s.ranges[rangeId];
		product storage selectedProduct = s.products[s.rangeToProduct[rangeId]];
		require(indexInRange >= selectedRange.rangeStart && indexInRange <= selectedRange.rangeEnd, "RAIR ERC721: Invalid token index");
		require(selectedRange.tokensAllowed > 0, "RAIR ERC721: Cannot mint more tokens in this range");
		require(selectedProduct.mintableTokens > 0, "RAIR ERC721: Cannot mint more tokens in this product");
		_safeMint(to, selectedProduct.startingToken + indexInRange, '');
		s.tokenToProduct[selectedProduct.startingToken + indexInRange] = s.rangeToProduct[rangeId];
		s.tokenToRange[selectedProduct.startingToken + indexInRange] = rangeId;
	}

	function mintFromProduct(address to, uint productId, uint indexInProduct) external onlyRole(MINTER) {
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		product storage selectedProduct = s.products[productId];
		require(indexInProduct >= selectedProduct.startingToken && indexInProduct <= selectedProduct.endingToken, "RAIR ERC721: Invalid token index");
		require(selectedProduct.mintableTokens > 0, "RAIR ERC721: Cannot mint more tokens in this product");
		_safeMint(to, selectedProduct.startingToken + indexInProduct, '');
	}

	function mintFromRangeBatch(
		address[] calldata to,
		uint rangeId,
		uint[] calldata indexInRange
	) external onlyRole(MINTER) {
		for (uint i = 0; i < to.length; i++) {
			mintFromRange(to[i], rangeId, indexInRange[i]);
		}
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

	function _approve(address to, uint256 tokenId) internal virtual {
		s._tokenApprovals[tokenId] = to;
		emit Approval(ownerOf(tokenId), to, tokenId);
	}

	function getApproved(uint256 tokenId) public view returns (address) {
		require(_exists(tokenId), "ERC721: approved query for nonexistent token");
		return s._tokenApprovals[tokenId];
	}
	
		/*
	/// @notice	Mints a specific token within a product
	/// @dev	Has to be used alongside getNextSequentialIndex to simulate a sequential minting
	/// @dev	Anyone that wants a specific token just has to call this
	/// @param	to					Address of the new token's owner
	/// @param	productId			Product to mint from
	/// @param	indexInProduct	Internal index of the token
	function mint(address to, uint productId, uint indexInProduct) internal {
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		product storage currentProduct = s.products[productId];
		
		require(indexInProduct <= currentProduct.endingToken - currentProduct.startingToken, "RAIR ERC721: Invalid token index");

		_safeMint(to, currentProduct.startingToken + indexInProduct);

		s.tokensByProduct[productId].push(currentProduct.startingToken + indexInProduct);

		s.tokenToProduct[currentProduct.startingToken + indexInProduct] = productId;
		currentProduct.mintableTokens--;

		range storage lock;

		for (uint i = 0; i < currentProduct.length; i++) {
			if (_lockedRange[currentProduct.locks[i]].startingToken <= currentProduct.startingToken + indexInProduct &&
					_lockedRange[currentProduct.locks[i]].endingToken >= currentProduct.startingToken + indexInProduct) {
				lock = _lockedRange[currentProduct.locks[i]];
				tokenToLock[currentProduct.startingToken + indexInProduct] = currentProduct.locks[i];
				if (lock.lockCountdown > 0) {
					lock.lockCountdown--;
					if (lock.lockCountdown == 0) {
						emit RangeUnlocked(productId, lock.startingToken, lock.endingToken);
					}
				}
				break;
			}
		}
		if (currentProduct.mintableTokens == 0) {
			emit ProductCompleted(productId, currentProduct.name);
		}
	}
		*/

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
			/*
			if (_lockedRange[tokenToLock[_tokenId]].productIndex == tokenToProduct[_tokenId]) {
				require(_lockedRange[tokenToLock[_tokenId]].lockCountdown == 0, "RAIR ERC721: Transfers for this range are currently locked");
			}
			*/
			_checkRole(TRADER, msg.sender);
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