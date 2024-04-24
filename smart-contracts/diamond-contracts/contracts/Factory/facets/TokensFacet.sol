// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { FactoryStorage } from "../AppStorage.sol";
import { AccessControlEnumerable } from "../../common/DiamondStorage/AccessControlEnumerable.sol";
import { FactoryHandlerRoles } from '../AccessControlRoles.sol';

/// @title 	Our Facet creator for tokens
/// @notice You can use this contract to manage the use of tokens
contract TokensFacet is AccessControlEnumerable, FactoryHandlerRoles {
	/// @notice Record of a change in accepted tokens
    /// @param 	contractAddress contains the address of the tokens contract 
    /// @param 	priceToDeploy contains the deployment cost for the token
    /// @param 	responsible address of the person that implement the new token
	event ChangedToken(address contractAddress, uint priceToDeploy, address responsible);
	/// @notice This event stores in the blockchain when the tokens are withdrawed from the contract
    /// @param 	recipient address who will recieve the tokens
    /// @param 	token contains the address of the tokens contract to withdraw
	/// @param 	amount total of tokens to recieve
	event WithdrawTokens(address recipient, address token, uint amount);

	/// @notice Transfers tokens from the factory to any of the OWNER addresses
	/// @dev 	AccessControl makes sure only an OWNER can withdraw
	/// @param 	amount	Amount of tokens to withdraw
	function withdrawTokens(uint amount) public onlyRole(ADMINISTRATOR) {
		FactoryStorage.Layout storage store = FactoryStorage.layout();
		IERC20(store.currentERC20).transfer(msg.sender, amount);
		emit WithdrawTokens(msg.sender, store.currentERC20, amount);
	}

	/// @notice	Adds an address to the list of allowed minters
	/// @param	_token	Address of the new Token
	/// @param	_priceToDeploy	Price of deployment for the new Token
	function changeToken(address _token, uint _priceToDeploy) public onlyRole(ADMINISTRATOR) {
		FactoryStorage.Layout storage store = FactoryStorage.layout();
		store.currentERC20 = _token;
		store.deploymentCostForToken[_token] = _priceToDeploy;
		emit ChangedToken(_token, _priceToDeploy, msg.sender);
	}

	/// @notice	Returns the number of required tokens to deploy a contract
	/// @return price 	Shows the price of deployment for the token
	function getDeploymentCost() public view returns (uint price) {
		FactoryStorage.Layout storage store = FactoryStorage.layout();
		price = FactoryStorage.layout().deploymentCostForToken[store.currentERC20];
	}
}