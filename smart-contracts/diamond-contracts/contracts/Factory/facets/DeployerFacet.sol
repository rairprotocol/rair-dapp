// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccessControlEnumerable } from "../../common/DiamondStorage/AccessControlEnumerable.sol";
import { RAIR721_Diamond } from "../../tokens/RAIR-721/RAIR-ERC721.sol";
import { FactoryStorage } from "../AppStorage.sol";

/// @title 	ERC721 factory
/// @notice	Facet receives ERC777 tokens and deploys an ERC721 smart contract
contract DeployerFacet is AccessControlEnumerable {
	/// @notice This event stores in the blockchain when a new contract is deployed
    /// @param	deployerAddress 	Contains the address of the deployer of the contract 
    /// @param 	deploymentIndex 	Contains the corresponding ID for the deployment
    /// @param 	deploymentAddress 	Contains the address where the contract was deployed
	/// @param 	deploymentName 		Contains the name of the deployed contract
	event DeployedContract(
		address deployerAddress,
		uint deploymentIndex,
		address deploymentAddress,
		string deploymentName
	);

	function deployContract(
		string calldata contractName,
		string calldata contractSymbol
	) external {
		FactoryStorage.Layout storage store = FactoryStorage.layout();
		require(
			IERC20(store.currentERC20).allowance(msg.sender, address(this)) >= store.deploymentCostForToken[store.currentERC20],
			'Deployer: Not allowed to transfer tokens'
		);
		require(
			IERC20(store.currentERC20).transferFrom(msg.sender, address(this), store.deploymentCostForToken[store.currentERC20]),
			'Deployer: Error transferring tokens'
		);

		address[] storage deploymentsFromOwner = store.creatorToContracts[msg.sender];
		store.totalUserPoints[msg.sender] += store.deploymentCostForToken[store.currentERC20];
		
		if (deploymentsFromOwner.length == 0) {
			store.creators.push(msg.sender);
		}

		RAIR721_Diamond newToken = new RAIR721_Diamond(contractName, contractSymbol, msg.sender, 30000);
		deploymentsFromOwner.push(address(newToken));
		store.contractToCreator[address(newToken)] = msg.sender;
		emit DeployedContract(msg.sender, deploymentsFromOwner.length - 1, address(newToken), contractName);
	}
}