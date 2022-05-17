// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

import '@openzeppelin/contracts/access/IAccessControl.sol';
import '../AppStorage.sol';

/// @title This is contract to manage the facet fees
/// @notice You can use this contract to update the facet and treasury
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerableMarket
contract FeesFacet is AccessControlAppStorageEnumerableMarket {
	bytes32 public constant MAINTAINER = keccak256("MAINTAINER");
	
	/// @notice This event stores in the blockchain when we update the decimals of a fee
    /// @param  decimals Contains the decimals established for the fee
    /// @param  precalculatedMultiplier Contains the value of the multiplayer for the fee
	event UpdatedDecimals(uint decimals, uint precalculatedMultiplier);
	/// @notice This event stores in the blockchain when we update the node fee
    /// @param  decimals Contains the decimals established for the fee
    /// @param  newPercentage Contains the value of the percentage to calculate the fee
	event UpdatedNodeFee(uint decimals, uint newPercentage);
	/// @notice This event stores in the blockchain when we update the fee of our treasury
    /// @param  decimals Contains the decimals established for the fee
    /// @param  newPercentage Contains the value of the percentage to calculate the treasury fee
	event UpdatedTreasuryFee(uint decimals, uint newPercentage);
	/// @notice This event stores in the blockchain when we update the decimals of a fee
    /// @param  newAddress Contains the new address that we set ad treasury
	event UpdatedTreasuryAddress(address newAddress);

	/// @notice Check the current decimals of the fee
    /// @return uint16 with the current decimals 
	function getDecimals() public view returns (uint16) {
		return s.decimals;
	}

	/// @notice Allow us to update the decimals that we use
	///	@dev	Only a MAINTAINER of the contract is allowed to make this change
	/// @param 	newDecimals_ Contains the value of the new decimals that we want to implement
	function updateDecimals(uint16 newDecimals_) public onlyRole(MAINTAINER) {
		s.decimals = newDecimals_;
		s.decimalPow = 10**newDecimals_;
		emit UpdatedDecimals(s.decimals, s.decimalPow);
	}

	/// @notice Allow us to check the value of the fee for the current node
	/// @return decimals 	Number of decimal spaces in the resulting node fee
	/// @return nodeFee 	Percentage of any minting offer that belongs to the node address
	function getNodeFee() public view returns (uint16 decimals, uint nodeFee) {
		return (s.decimals, s.nodeFee);
	}

	/// @notice Allow us to update the current fee of the node
	///	@dev	Only a MAINTAINER of the contract is allowed to make this change
	/// @param 	newFee_ establish the new value that we want to set as fee
	function updateNodeFee(uint newFee_) public onlyRole(MAINTAINER) {
		require(newFee_ <= 100 * s.decimalPow, "Marketplace: Invalid Fee!");
		s.nodeFee = newFee_;
		emit UpdatedNodeFee(s.decimals, newFee_);
	}

	/// @notice Allow us to check the current Treasury fee
	/// @return decimals containt the current decimals that use the fee
	/// @return treasuryFee constain the current fee of the treasury
	function getTreasuryFee() public view returns (uint16 decimals, uint treasuryFee) {
		return (s.decimals, s.treasuryFee);
	}

	/// @notice Allow us to modify the current treasury fee
	///	@dev	Only a MAINTAINER he new fee that we want to implement for the treasury
	/// @param 	newFee_ establish the new value that we want to set as treasury fee
	function updateTreasuryFee(uint newFee_) public onlyRole(MAINTAINER) {
		require(newFee_ <= 100 * s.decimalPow, "Marketplace: Invalid Fee!");
		s.treasuryFee = newFee_;
		emit UpdatedTreasuryFee(s.decimals, newFee_);
	}

	/// @notice Allow us to check the current Treasury fee
	/// @return address which contains the treasury contract address
	function getTreasuryAddress() public view returns (address) {
		return s.treasuryAddress;
	}

	/// @notice Allow us to modify the address that we use as treasury
	///	@dev	Only a MAINTAINER he new fee that we want to implement for the treasury
	/// @param 	newAddress_ contains the new address that we want to establish as treasury
	function updateTreasuryAddress(address newAddress_) public onlyRole(MAINTAINER) {
		s.treasuryAddress = newAddress_;
		emit UpdatedTreasuryAddress(newAddress_);
	}
}