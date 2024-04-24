// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/ERC721Enumerable.sol)

pragma solidity ^0.8.25;

import {ERC721Facet} from "./ERC721Facet.sol";
import {IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ERC721Storage} from "../AppStorage.sol";

// Copy of the OpenZeppelin code using diamond storage
/**
 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds enumerability
 * of all the token ids in the contract as well as all token ids owned by each account.
 *
 * CAUTION: `ERC721` extensions that implement custom `balanceOf` logic, such as `ERC721Consecutive`,
 * interfere with enumerability and should not be used together with `ERC721Enumerable`.
 */
contract ERC721EnumerableFacet is ERC721Facet, IERC721Enumerable {
    /**
     * @dev An `owner`'s token query was out of bounds for `index`.
     *
     * NOTE: The owner being `address(0)` indicates a global out of bounds index.
     */
    error ERC721OutOfBoundsIndex(address owner, uint256 index);

    /**
     * @dev Batch mint is not allowed.
     */
    error ERC721EnumerableForbiddenBatchMint();

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view override(IERC165, ERC721Facet) returns (bool) {
        return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        if (index >= balanceOf(owner)) {
            revert ERC721OutOfBoundsIndex(owner, index);
        }
        ERC721Storage.Layout storage store = ERC721Storage.layout();
        return store._ownedTokens[owner][index];
    }

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view returns (uint256) {
        ERC721Storage.Layout storage store = ERC721Storage.layout();
        return store._allTokens.length;
    }

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view returns (uint256) {
        if (index >= totalSupply()) {
            revert ERC721OutOfBoundsIndex(address(0), index);
        }
        ERC721Storage.Layout storage store = ERC721Storage.layout();
        return store._allTokens[index];
    }

    /**
     * @dev See {ERC721-_update}.
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);

        // Custom functionality for rair
        // If it's not minting or burning 
		if (previousOwner != address(0) && to != address(0)) {
            ERC721Storage.Layout storage store = ERC721Storage.layout();
            if (store.requiresTrader) {
			    _checkRole(TRADER, msg.sender);
            }
			require(
                store.ranges[store.tokenToRange[tokenId]].lockedTokens == 0,
                "RAIR ERC721: Cannot transfer from a locked range!"
            );
		}

        if (previousOwner == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (previousOwner != to) {
            _removeTokenFromOwnerEnumeration(previousOwner, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (previousOwner != to) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }

        return previousOwner;
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to) - 1;
        ERC721Storage.Layout storage store = ERC721Storage.layout();
        store._ownedTokens[to][length] = tokenId;
        store._ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        ERC721Storage.Layout storage store = ERC721Storage.layout();
        store._allTokensIndex[tokenId] = store._allTokens.length;
        store._allTokens.push(tokenId);
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

        uint256 lastTokenIndex = balanceOf(from);
        ERC721Storage.Layout storage store = ERC721Storage.layout();
        uint256 tokenIndex = store._ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = store._ownedTokens[from][lastTokenIndex];

            store._ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            store._ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete store._ownedTokensIndex[tokenId];
        delete store._ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).
        ERC721Storage.Layout storage store = ERC721Storage.layout();

        uint256 lastTokenIndex = store._allTokens.length - 1;
        uint256 tokenIndex = store._allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = store._allTokens[lastTokenIndex];

        store._allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        store._allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete store._allTokensIndex[tokenId];
        store._allTokens.pop();
    }

    /**
     * See {ERC721-_increaseBalance}. We need that to account tokens that were minted in batch
     */
    function _increaseBalance(address account, uint128 amount) internal override {
        if (amount > 0) {
            revert ERC721EnumerableForbiddenBatchMint();
        }
        super._increaseBalance(account, amount);
    }
}
