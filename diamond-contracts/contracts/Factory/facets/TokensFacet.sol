// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '../AppStorage.sol';
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

contract TokensFacet is AccessControlAppStorageEnumerable {
	bytes32 constant OWNER = keccak256("OWNER");
	bytes32 constant ERC777 = keccak256("ERC777");
	
	event NewTokenAccepted(address contractAddress, uint priceToDeploy, address responsible);
	event TokenNoLongerAccepted(address erc777, address responsible);
	event TokensWithdrawn(address recipient, address erc777, uint amount);

	/// @notice Transfers tokens from the factory to any of the OWNER addresses
	/// @dev 	If the contract has less than the amount, the ERC777 contract will revert
	/// @dev 	AccessControl makes sure only an OWNER can withdraw
	/// @param 	erc777	Address of the ERC777 contract
	/// @param 	amount	Amount of tokens to withdraw
	function withdrawTokens(address erc777, uint amount) public onlyRole(OWNER) {
		require(hasRole(ERC777, erc777), "RAIR Factory: Specified contract isn't an approved erc777 contract");
		IERC777(erc777).send(msg.sender, amount, bytes("Factory Withdraw"));
		emit TokensWithdrawn(msg.sender, erc777, amount);
	}

	/// @notice	Adds an address to the list of allowed minters
	/// @param	_erc777Address	Address of the new Token
	function acceptNewToken(address _erc777Address, uint _priceToDeploy) public onlyRole(OWNER) {
		grantRole(ERC777, _erc777Address);
		s.deploymentCostForToken[_erc777Address] = _priceToDeploy;
		emit NewTokenAccepted(_erc777Address, _priceToDeploy, msg.sender);
	}

	/// @notice	Removes an address from the list of allowed minters
	/// @param	_erc777Address	Address of the Token
	function removeToken(address _erc777Address) public onlyRole(OWNER) {
		revokeRole(ERC777, _erc777Address);
		s.deploymentCostForToken[_erc777Address] = 0;
		emit TokenNoLongerAccepted(_erc777Address, msg.sender);
	}

	function getDeploymentCost(address erc777) public view returns (uint price) {
		price = s.deploymentCostForToken[erc777];
	}
}