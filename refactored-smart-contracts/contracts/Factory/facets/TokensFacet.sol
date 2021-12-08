// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '../AppStorage.sol';
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

contract TokensFacet is AccessControlAppStorageEnumerable {
	bytes32 constant OWNER = keccak256("OWNER");
	bytes32 constant ERC777 = keccak256("ERC777");
	
	event TokensWithdrawn(address recipient, address erc777, uint amount);

	/// @notice Transfers tokens from the factory to any of the OWNER addresses
	/// @dev 	If the contract has less than the amount, the ERC777 contract will revert
	/// @dev 	AccessControl makes sure only an OWNER can withdraw
	/// @param 	erc777	Address of the ERC777 contract
	/// @param 	amount	Amount of tokens to withdraw
	function withdrawTokens(address erc777, uint amount) public onlyRole(OWNER) {
		require(hasRole(ERC777, erc777), "RAIR Factory: Specified contract isn't an approved erc777 contract");
		IERC777(erc777).send(msg.sender, amount, "Factory Withdraw");
		emit TokensWithdrawn(msg.sender, erc777, amount);
	}
}