// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import './AppStorage.sol';

contract ERC721Facet is AccessControlAppStorageEnumerable721 {
	bytes32 public constant TRADER = keccak256("TRADER");

	function name() public view returns (string memory name) {
		name = s._name;
	}

	function symbol() public view returns (string memory symbol) {
		symbol = s._symbol;
	}

	/// @notice	Overridden function from the ERC721 contract that returns our
	///			variable base URI instead of the hardcoded URI
	function _baseURI() internal view returns (string memory) {
		return s.baseURI;
	}
	
	/// @notice Queries if an operator can act on behalf of an owner on all of their tokens
	/// @dev Overrides the OpenZeppelin standard by allowing anyone with the TRADER role to transfer tokens
	/// @param owner 		Owner of the tokens.
	/// @param operator 	Operator of the tokens.
	function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {
        return (hasRole(TRADER, operator) || s._operatorApprovals[owner][operator]);
    }
}