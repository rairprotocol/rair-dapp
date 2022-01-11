// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

import '../AppStorage.sol';

contract creatorFacet is AccessControlAppStorageEnumerable {
	/// @notice Returns the number of addresses that have deployed a contract
	function getCreatorsCount() public view returns(uint count) {
		return s.creators.length;
	}

	/// @notice Returns a single address inside the creators array
	function getCreatorAtIndex(uint index) public view returns (address creator) {
		creator = s.creators[index];
	}

	/// @notice Returns the number of contracts deployed by an address
	/// @dev	Use alongside creatorToContracts for the full list of tokens 
	/// @param	deployer	Wallet address to query
	function getContractCountOf(address deployer) public view returns(uint count) {
		return s.creatorToContracts[deployer].length;
	}

	/// @notice Necessary view function now that public mappings are not possible
	function creatorToContractIndex(address deployer, uint index) public view returns(address deployedContract) {
		return s.creatorToContracts[deployer][index];
	}

	/// @notice Returns the whole array of deployed addresses of a creator
	function creatorToContractList(address deployer) public view returns(address[] memory deployedContracts) {
		return s.creatorToContracts[deployer];
	}

	/// @notice Returns the address of the creator given a deployed contract's address
	function contractToCreator(address deployedContract) public view returns (address creator) {
		creator = s.contractToCreator[deployedContract];
	}
}