// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

import '../AppStorage.sol';
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

/// @title 	Our Facet creator for tokens
/// @notice You can use this contract to manage the use of tokens
contract TokensFacet is AccessControlAppStorageEnumerable {
	bytes32 constant OWNER = keccak256("OWNER");
	bytes32 constant ERC777 = keccak256("ERC777");
	
	/// @notice This event stores in the blockchain when a new token is indexed as accepted 
    /// @param 	contractAddress contains the address of the tokens contract 
    /// @param 	priceToDeploy contains the deployment cost for the token
    /// @param 	responsible address of the person that implement the new token
	event AcceptedToken(address contractAddress, uint priceToDeploy, address responsible);
	/// @notice This event stores in the blockchain when a token is revoked
    /// @param 	erc777 contains the address of the tokens contract to remove
    /// @param 	responsible address of the person that revokes the token
	event RemovedToken(address erc777, address responsible);
	/// @notice This event stores in the blockchain when the tokens are withdrawed from the contract
    /// @param 	recipient address who will recieve the tokens
    /// @param 	erc777 contains the address of the tokens contract to withdraw
	/// @param 	amount total of tokens to recieve
	event WithdrawTokens(address recipient, address erc777, uint amount);

	/// @notice Transfers tokens from the factory to any of the OWNER addresses
	/// @dev 	If the contract has less than the amount, the ERC777 contract will revert
	/// @dev 	AccessControl makes sure only an OWNER can withdraw
	/// @param 	erc777	Address of the ERC777 contract
	/// @param 	amount	Amount of tokens to withdraw
	function withdrawTokens(address erc777, uint amount) public onlyRole(OWNER) {
		require(hasRole(ERC777, erc777), "RAIR Factory: Specified contract isn't an approved erc777 contract");
		IERC777(erc777).send(msg.sender, amount, bytes("Factory Withdraw"));
		emit WithdrawTokens(msg.sender, erc777, amount);
	}

	/// @notice	Adds an address to the list of allowed minters
	/// @param	_erc777Address	Address of the new Token
	/// @param	_priceToDeploy	Price of deployment for the new Token
	function acceptNewToken(address _erc777Address, uint _priceToDeploy) public onlyRole(OWNER) {
		grantRole(ERC777, _erc777Address);
		s.deploymentCostForToken[_erc777Address] = _priceToDeploy;
		emit AcceptedToken(_erc777Address, _priceToDeploy, msg.sender);
	}

	/// @notice	Removes an address from the list of allowed minters
	/// @param	_erc777Address	Address of the Token
	function removeToken(address _erc777Address) public onlyRole(OWNER) {
		revokeRole(ERC777, _erc777Address);
		s.deploymentCostForToken[_erc777Address] = 0;
		emit RemovedToken(_erc777Address, msg.sender);
	}

	/// @notice	Returns the number of required tokens, given an erc777 address
	/// @param 	erc777 	Contains the facet addresses and function selectors
	/// @return price 	Shows the price of deployment for the token
	function getDeploymentCost(address erc777) public view returns (uint price) {
		price = s.deploymentCostForToken[erc777];
	}
}