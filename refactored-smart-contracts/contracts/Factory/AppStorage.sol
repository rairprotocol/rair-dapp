// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

struct AppStorage {
	mapping(address => address[]) ownerToContracts;
	mapping(address => address) contractToOwner;
	mapping(address => uint) deploymentCostForERC777;
	address[] creators;
}

library LibAppStorage {
	function diamondStorage() internal pure	returns (AppStorage storage ds) {
		assembly {
			ds.slot := 0
		}
	}
}