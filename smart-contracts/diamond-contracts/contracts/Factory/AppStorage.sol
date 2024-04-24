// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library FactoryStorage {
    bytes32 internal constant STORAGE_SLOT =
        keccak256('rair.contracts.storage.DiamondFactory');

    struct Layout {
        address[] creators;
		mapping(address => address[]) creatorToContracts;
		mapping(address => address) contractToCreator;
		mapping(address => uint) deploymentCostForToken;
        address currentERC20;
        mapping(address => uint) currentUserPoints;
        mapping(address => uint) totalUserPoints;
        uint transferTimeLimit;
        address facetSource;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}