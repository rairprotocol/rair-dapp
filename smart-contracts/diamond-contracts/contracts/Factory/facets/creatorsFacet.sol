// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

import { AccessControlEnumerable } from "../../common/DiamondStorage/AccessControlEnumerable.sol";
import { FactoryStorage } from "../AppStorage.sol";

/// @title 	Our Facet creators contract
/// @notice You can use this contract to view the creator of contracts and the list of contractsdeployed
contract CreatorsFacet is AccessControlEnumerable {
	/// @notice Returns the number of addresses that have deployed a contract
	/// @return count with the total of creators of this contract
	function getCreatorsCount() public view returns(uint count) {
		return FactoryStorage.layout().creators.length;
	}

	/// @notice Returns a single address inside the creators array
	/// @param 	index number of the index for look inside our array
	/// @return creator 	Address of the selected index
	function getCreatorAtIndex(uint index) public view returns (address creator) {
		creator = FactoryStorage.layout().creators[index];
	}

	/// @notice Returns the number of contracts deployed by an address
	/// @dev	Use alongside creatorToContracts for the full list of tokens 
	/// @param	deployer	Wallet address to query
	/// @return count 	Number of contracts deployed by the deployer
	function getContractCountOf(address deployer) public view returns(uint count) {
		return FactoryStorage.layout().creatorToContracts[deployer].length;
	}

	/// @notice Necessary view function now that public mappings are not possible
	/// @param 	deployer Contains the facet addresses and function selectors
	/// @param 	index Contains the facet addresses and function selectors
	/// @return deployedContract 	Address of the deployed ERC721
	function creatorToContractIndex(address deployer, uint index) public view returns(address deployedContract) {
		return FactoryStorage.layout().creatorToContracts[deployer][index];
	}

	/// @notice Returns the whole array of deployed addresses of a creator
	/// @param 	deployer Contains the facet addresses and function selectors
	/// @return deployedContracts 	Addresses of the deployed contracts  
	function creatorToContractList(address deployer) public view returns(address[] memory deployedContracts) {
		return FactoryStorage.layout().creatorToContracts[deployer];
	}

	/// @notice Returns the address of the creator given a deployed contract's address
	/// @param 	deployedContract Contains the facet addresses and function selectors
	/// @return creator 	Address of the contracts creator
	function contractToCreator(address deployedContract) public view returns (address creator) {
		creator = FactoryStorage.layout().contractToCreator[deployedContract];
	}

	/// @notice Returns the address of the creator given a deployed contract's address
	/// @param 	facetSource 	Contains the facet addresses and function selectors
	function setFacetSource(address facetSource) public {
		FactoryStorage.Layout storage store = FactoryStorage.layout();
		store.facetSource = facetSource;
	}

	function getFacetSource() public view returns (address facetSource) {
		facetSource = FactoryStorage.layout().facetSource;
	}
}