// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '@openzeppelin/contracts/access/IAccessControl.sol';
import '../AppStorage.sol';

contract FeesFacet is AccessControlAppStorageEnumerableMarket {
	bytes32 public constant MAINTAINER = keccak256("MAINTAINER");
	
	event UpdatedDecimals(uint decimals, uint precalculatedMultiplier);
	event UpdatedNodeFee(uint decimals, uint newPercentage);
	event UpdatedTreasuryFee(uint decimals, uint newPercentage);
	event UpdatedTreasuryAddress(address newAddress);

	function getDecimals() public view returns (uint16) {
		return s.decimals;
	}

	function updateDecimals(uint16 newDecimals_) public onlyRole(MAINTAINER) {
		s.decimals = newDecimals_;
		s.decimalPow = 10**newDecimals_;
		emit UpdatedDecimals(s.decimals, s.decimalPow);
	}

	function getNodeFee() public view returns (uint16 decimals, uint nodeFee) {
		return (s.decimals, s.nodeFee);
	}

	function updateNodeFee(uint newFee_) public onlyRole(MAINTAINER) {
		require(newFee_ <= 100 * s.decimalPow, "Marketplace: Invalid Fee!");
		s.nodeFee = newFee_;
		emit UpdatedNodeFee(s.decimals, newFee_);
	}

	function getTreasuryFee() public view returns (uint16 decimals, uint treasuryFee) {
		return (s.decimals, s.treasuryFee);
	}

	function updateTreasuryFee(uint newFee_) public onlyRole(MAINTAINER) {
		require(newFee_ <= 100 * s.decimalPow, "Marketplace: Invalid Fee!");
		s.treasuryFee = newFee_;
		emit UpdatedTreasuryFee(s.decimals, newFee_);
	}

	function getTreasuryAddress() public view returns (address) {
		return s.treasuryAddress;
	}

	function updateTreasuryAddress(address newAddress_) public onlyRole(MAINTAINER) {
		s.treasuryAddress = newAddress_;
		emit UpdatedTreasuryAddress(newAddress_);
	}
}