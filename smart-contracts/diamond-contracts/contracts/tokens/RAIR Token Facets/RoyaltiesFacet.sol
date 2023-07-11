// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import './AppStorage.sol';
import '../IERC2981.sol';
/// @title  ERC2981 facet for RAIR diamond contracts
/// @notice Adds support for royalties
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerable721
contract RAIRRoyaltiesFacet is AccessControlAppStorageEnumerable721, IERC2981 {
	bytes32 public constant CREATOR = keccak256("CREATOR");
	/// @notice Returns the fee for the NFT sale
	/// @param 	_tokenId		the NFT asset queried for royalty information
	/// @param 	_salePrice		the sale price of the NFT asset specified by _tokenId
	/// @return receiver		address of who should be sent the royalty payment
	/// @return royaltyAmount	the royalty payment amount for _salePrice sale price
	function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
		external view override(IERC2981) returns (address receiver, uint256 royaltyAmount) {
		return (getRoleMember(CREATOR, 0), (_salePrice * s.royaltyFee) / 100000);
	}

	function royaltyFee() external view returns(uint16) {
		return s.royaltyFee;
	}

	function supportsInterface(bytes4 interfaceId) public view virtual override(IERC2981) returns (bool) {
		return interfaceId == type(IERC2981).interfaceId;
	}
}