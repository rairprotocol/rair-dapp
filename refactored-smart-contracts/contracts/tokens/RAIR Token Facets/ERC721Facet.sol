// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import './AppStorage.sol';

contract ERC721Facet is IERC721, ERC721Enumerable, AccessControlAppStorageEnumerable721 {
	bytes32 public constant TRADER = keccak256("TRADER");

	constructor() ERC721("","") {}
	
	/// @notice Queries if an operator can act on behalf of an owner on all of their tokens
	/// @dev Overrides the OpenZeppelin standard by allowing anyone with the TRADER role to transfer tokens
	/// @param owner 		Owner of the tokens.
	/// @param operator 	Operator of the tokens.
	function isApprovedForAll(address owner, address operator) public view virtual override(ERC721, IERC721) returns (bool) {
        return (hasRole(TRADER, operator) || s._operatorApprovals[owner][operator]);
    }
}