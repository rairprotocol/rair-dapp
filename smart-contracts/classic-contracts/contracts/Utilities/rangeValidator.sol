// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import 'openzeppelin-v4.7.1/token/ERC721/ERC721.sol';

contract RAIR_Range_validator {
    /// @notice 	Loops over the tokens in a specific range of tokens looking for one that belongs to the user
	/// @dev 		Loops are expensive in solidity, do not use this in a function that requires gas.
	/// @param 		erc721Address 	ERC721 contract where the owner will be searched for
	/// @param 		userAddress 	Address that must be found in the range of tokens
	/// @param 		startingToken 	Start of the range
	/// @param 		endingToken 	End of the range
	function hasTokenInRange(
		address erc721Address,
		address userAddress,
		uint startingToken,
		uint endingToken
	) external view returns (bool) {
        ERC721 contractInstance = ERC721(erc721Address);
		for (uint i = startingToken; i < endingToken; i++) {
			if (contractInstance.ownerOf(i) == userAddress) {
				return true;
			}
		}
		return false;
	}
}