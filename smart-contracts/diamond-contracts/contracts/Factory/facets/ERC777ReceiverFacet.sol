// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19; 

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import { AccessControlEnumerable } from "../../common/DiamondStorage/AccessControlEnumerable.sol";
import { RAIR_ERC721_Diamond } from '../../tokens/RAIR-ERC721-Diamond.sol';
import { FactoryStorage } from "../AppStorage.sol";

/// @title 	ERC721 factory
/// @notice	Facet receives ERC777 tokens and deploys an ERC721 smart contract
contract ERC777ReceiverFacet is IERC777Recipient, AccessControlEnumerable {
	bytes32 constant ERC777 = keccak256("ERC777");
	
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
	
	/// @notice Function called by an ERC777 when they send tokens
	/// @dev   	This is our deployment mechanism for ERC721 contracts!
	/// @param 	operator 		The ERC777 operator calling the send() function
	/// @param 	from 			The owner of the tokens
	/// @param 	to 				The recipient of the tokens
	/// @param 	amount 			The number of tokens sent
	/// @param 	userData 		bytes sent from the send call
	/// @param 	operatorData 	bytes sent from the operator
	function tokensReceived(
		address operator,
		address from,
		address to,
		uint256 amount,
		bytes calldata userData,
		bytes calldata operatorData
	) external onlyRole(ERC777) override {
		FactoryStorage.Layout storage store = FactoryStorage.layout();

		require(
			amount >= store.deploymentCostForToken[msg.sender],
			'HOT Factory: not enough RAIR tokens to deploy a contract'
		);

		if (amount - (store.deploymentCostForToken[msg.sender]) > 0) {
			IERC777(msg.sender)
				.send(
					from,
					amount - (store.deploymentCostForToken[msg.sender]),
					bytes("HOT")
				);
		}
		address[] storage deploymentsFromOwner = store.creatorToContracts[from];
		
		if (deploymentsFromOwner.length == 0) {
			store.creators.push(from);
		}

		RAIR_ERC721_Diamond newToken = new RAIR_ERC721_Diamond(string(userData), from, 30000);
		deploymentsFromOwner.push(address(newToken));
		store.contractToCreator[address(newToken)] = from;
		emit DeployedContract(from, deploymentsFromOwner.length - 1, address(newToken), string(userData));
	}
}