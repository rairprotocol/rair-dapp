// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import {ERC721Storage} from "../AppStorage.sol";
import {ERC721AccessControlRoles} from "../AccessControlRoles.sol";
import {AccessControlEnumerable} from "../../../common/DiamondStorage/AccessControlEnumerable.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";

/// @title  ERC2981 facet for RAIR diamond contracts
/// @notice Functions needed for royalty standard
/// @author Juan M. Sanchez M.
contract RAIRRoyaltiesFacet is ERC721AccessControlRoles, AccessControlEnumerable, ERC2981 {
	/// @notice Returns the fee for the NFT sale
	/// @param 	tokenId		the NFT asset queried for royalty information
	/// @param 	salePrice	the sale price of the NFT asset specified by _tokenId
	/// @return address		address of who should be sent the royalty payment
	/// @return uint256		the royalty payment amount for _salePrice sale price
    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view override returns (address, uint256) {
		return (
			getRoleMember(CREATOR, 0),
			(salePrice * ERC721Storage.layout().royaltyFee) / 100000
		);
	}

	function royaltyFee() external view returns(uint16) {
		return ERC721Storage.layout().royaltyFee;
	}
}