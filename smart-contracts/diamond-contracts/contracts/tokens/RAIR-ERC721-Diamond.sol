// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

// Interfaces
//import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import '@openzeppelin/contracts/utils/Address.sol';

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';

import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

import "../diamondStandard/interfaces/IDiamondLoupe.sol";

import './RAIR Token Facets/AppStorage.sol';

/// @title  RAIR 721 Diamond
/// @notice Diamond Contract implementing the bare minimum ERC-721 features
/// @author Juan M. Sanchez M.
contract RAIR_ERC721_Diamond is AccessControlAppStorageEnumerable721, IERC721, ERC165 {
	using Address for address;
	using Strings for uint256;

	bytes32 public constant CREATOR = keccak256("CREATOR");
	bytes32 public constant MINTER = keccak256("MINTER");
	bytes32 public constant TRADER = keccak256("TRADER");
	bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

	/**
	 * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
	 */
	constructor(string memory name_, address creatorAddress_, uint16 creatorRoyalty_) {
		s._name = name_;
		s._symbol = "RAIR";
		
		s.factoryAddress = msg.sender;
		s.royaltyFee = creatorRoyalty_;
		_setRoleAdmin(MINTER, CREATOR);
		_setRoleAdmin(TRADER, CREATOR);
		_grantRole(CREATOR, creatorAddress_);
		_grantRole(MINTER, creatorAddress_);
		_grantRole(TRADER, creatorAddress_);
	}

	function getFactoryAddress() public view returns (address) {
		return s.factoryAddress;
	}

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

	/// @notice Queries if an operator can act on behalf of an owner on all of their tokens
	/// @dev Overrides the OpenZeppelin standard by allowing anyone with the TRADER role to transfer tokens
	/// @param owner 		Owner of the tokens.
	/// @param operator 	Operator of the tokens.
	function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {
		return (hasRole(TRADER, operator) || s._operatorApprovals[owner][operator]);
	}

	function ownerOf(uint256 tokenId) public view returns (address) {
		address owner = s._owners[tokenId];
		require(owner != address(0), "ERC721: owner query for nonexistent token");
		return owner;
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

	function contractURI() public view returns (string memory) {
		return s.contractMetadataURI;
	}

	/// @notice	Returns a token's URI, could be specific or general
	/// @dev	IF the specific token URI doesn't exist, the general base URI will be returned
	/// @param	tokenId		Token Index to look for
	function tokenURI(uint tokenId) public view returns (string memory) {
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
		string memory URI = s.uniqueTokenURI[tokenId];
		if (bytes(URI).length > 0) {
			return URI;
		}
		URI = s.productURI[s.tokenToProduct[tokenId]];
		if (bytes(URI).length > 0) {
			if (s.appendTokenIndexToProductURI[s.tokenToProduct[tokenId]]) {
				return string(abi.encodePacked(URI, tokenToProductIndex(tokenId).toString()));
			}
			return URI; 
		}
		URI = s.baseURI;
		if (bytes(URI).length > 0) {
			if (s.appendTokenIndexToBaseURI) {
				return string(abi.encodePacked(URI, tokenId.toString()));
			}
			return URI;
		}
		return "";
	}

	/// @notice	Returns the token index inside the product
	/// @param	token	Token ID to find
	function tokenToProductIndex(uint token) public view returns (uint tokenIndex) {
		return token - s.products[s.tokenToProduct[token]].startingToken;
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

	function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
        	interfaceId == type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

	fallback() external {
		address facet = IDiamondLoupe(s.factoryAddress).facetAddress(msg.sig);
		assembly {
			// copy function selector and any arguments
			calldatacopy(0, 0, calldatasize())
			// execute function call using the facet
			let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
			// get any return value
			returndatacopy(0, 0, returndatasize())
			// return any return value or error back to the caller
			switch result
				case 0 {
					revert(0, returndatasize())
				}
				default {
					return(0, returndatasize())
				}
		}
	}
}